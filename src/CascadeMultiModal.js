/**
 * CascadeMultiSelect Component
 * All rights reserved.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import classnames from 'classnames';
import deepcopy from 'lodash/cloneDeep';
import { Button, Modal, Icon } from 'ygd';

import CascadeMultiPanel from './CascadeMultiPanel';
import i18n from './locale';

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_587802_fmlwv8dnoj9.js', // 在 iconfont.cn 上生成
});
class CascadeMultiModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      options: props.options,
      visible: false,
      expand: true,
      result: {},
      selectedNums: 0,
    };
    this.data = {
      value: props.value,
      options: props.options,
      result: {},
    };
    const { value, options } = props;
    this.initResult(value, options);
  }

  onOk() {
    const { value, options, result } = this.state;

    this.initResult(value, options);
    const { valueList, labelList } = this.data.result;
    const { leafList } = result;

    this.props.onOk(valueList, labelList, leafList);
    this.setState({ visible: false });
  }

  onCancel() {
    const { value, options, result } = this.data;
    this.setState({
      visible: false,
      value,
      options,
      result,
    }, () => {
      this.props.onCancel();
    });
  }

  onSelect(valueList, labelList, leafList) {

    this.setState({
      value: valueList,
      result: {
        valueList,
        labelList,
        leafList,
      },
    }, () => {
      this.props.onSelect(valueList, labelList, leafList);
    });
  }

  onDelete(key) {
    const { options } = this.props;
    const { value } = this.state;
    const index = value.indexOf(key);
    if (index !== -1) {
      value.splice(index, 1);
    }
    this.initResult(value, options);
    this.setState({ value, options });
  }

  onExpand(expand) {
    this.setState({
      expand,
    });
  }

  getSelectResult(value, dataList, keyArr, textArr, parentItem, mapRoot, isTop = true) {
    const { showChildrenCheck } = this.props;
    if (dataList && dataList.length) {
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i];

        if (!value.length) { return; }
        if (!isTop && value.indexOf(item.value) !== -1) {
          // console.warn(value, item.value, 'selectResult');
          keyArr.push(item.value);
          textArr.push(item.label);
          if (!!parentItem) {
            mapRoot[parentItem.label].push(item); // DestArr;
          }

          value.splice(value.indexOf(item.value), 1);
        } else if (showChildrenCheck && value.indexOf(item.value) !== -1) {

          this.selectChildrenResult(item, keyArr, textArr, mapRoot);
        }
        if (item.children) {
          this.getSelectResult(value, item.children, keyArr, textArr, item, mapRoot, false);
        }
      }
    }
  }

  selectChildrenResult(parentItem, keyArr, textArr, mapRoot) {
    const pData = parentItem.children;
    if (pData && pData.length) {
      for (let i = 0; i < pData.length; i++) {
        const item = pData[i];
        mapRoot[parentItem.label].push(item);

        keyArr.push(item.value);
        textArr.push(item.label);

      }
    }
  }


  initResult(value, options) {

    const keyArr = [];
    const textArr = [];
    const mapRoot = {};
    for (let key of options) {
      mapRoot[key.label] = [];
    }

    const valueList = deepcopy(value);
    const { showChildrenCheck } = this.props;
    const isTop = showChildrenCheck;// 顶级不处理
    // this.mapRoot = mapRoot;
    this.getSelectResult(valueList, options, keyArr, textArr, null, mapRoot, isTop);

    this.data.value = keyArr;
    this.data.result = {
      mapRoot: mapRoot,
      valueList: keyArr,
      labelList: textArr,
    };
    console.log('result', this.data.result);
  }

  renderDialog() {
    const { prefixCls, locale, title, cascadeSize, width } = this.props;
    const { visible, value } = this.state;
    if (!visible) { return null; }
    // 设置 dialog 默认宽度
    const defaultWidth = width || cascadeSize * 150 + 2; // 220 +

    const footer = (
      <React.Fragment>
        <div className="w50 tl">
          <span>
            已选择
          </span>
          <span className="selectedNum">
            {value.length}
          </span>
          <span>
            个城市
          </span>
        </div>
        <div className="w50">
          <Button type="default"
            onClick={() => {
              this.onCancel();
            }}>
            取消
          </Button>
          <Button type="primary"
            onClick={() => {
              this.onOk();
            }}>
            添加
          </Button>
        </div>
      </React.Fragment>
    );
    return (
      <Modal

        className={`${prefixCls}-model`}
        title={title || i18n(locale).title}
        visible={visible}
        locale={locale}
        width={defaultWidth + 20}
        onOk={() => {
          this.onOk();
        }}
        onCancel={() => {
          this.onCancel();
        }}
        footer={footer}
      >
        {this.renderContent()}
      </Modal>
    );
  }

  // {i18n(locale).selected} {this.renderResultNums()}
  renderContent() {
    const { value, options } = this.state;

    return (
      <div>
        <CascadeMultiPanel
          {...this.props}
          value={value}
          options={options}
          onSelect={(valueList, labelList, leafList) => {
            this.onSelect(valueList, labelList, leafList);
          }}
          allowRenderResult={false}
          renderResultNums={this.renderResultNums}
          ref={(r) => { this.refCascadeMulti = r; }}
          mode="mix"
        />
      </div>
    );
  }

  renderResult() {
    const { prefixCls } = this.props;
    return (
      <div
        className={`${prefixCls}-model-result`}
      >
        {this.renderResultList()}
        {this.renderExpand()}
      </div>
    );
  }

  renderExpand() {
    const { prefixCls, locale } = this.props;
    const { expand } = this.state;
    const { labelList } = this.data.result;
    if (!labelList || !labelList.length) { return null; }
    let arr = null;
    if (expand) {
      arr = (
        <span
          className={`${prefixCls}-model-expand`}
          onClick={() => { this.onExpand(false); }}
        >
          {i18n(locale).close}
        </span>
      );
    } else {
      arr = (
        <span
          className={`${prefixCls}-model-expand`}
          onClick={() => { this.onExpand(true); }}
        >
          {i18n(locale).expandAll}
          {labelList.length}
          {i18n(locale).item}
        </span>
      );
    }
    return arr;
  }

  renderChildrenList(valueList, labelList) {
    const { prefixCls } = this.props;
    const { expand } = this.state;
    if (!labelList) { return null; }
    const arr = [];
    const style = {};
    if (expand) {
      style.height = 'auto';
    } else {
      style.maxHeight = 76;
    }
    labelList.forEach((item, index) => {

      arr.push(
        <li className={`${prefixCls}-model-result-ul-list`} key={valueList[index]}>
          <span className={`${prefixCls}-model-result-ul-list-content`}>{item}</span>
          <MyIcon
            className={`${prefixCls}-model-result-ul-list-remove yg-icon yg-icon-close`}
            type="ego-close_16px" onClick={() => { this.onDelete(valueList[index]); }} />

        </li>
      );
    });
    return (
      <ul
        className={`${prefixCls}-model-result-ul`}
        style={style}
      >
        {arr}
      </ul>
    );
  }
  renderFirstLevel = (mapRoot) => {
    const myResult = [];
    // const that = this;
    Object.keys(mapRoot).forEach((key) => {

      console.log(key, mapRoot[key]);
      let valueList = [];
      let labelList = [];
      for (let i = 0; i < mapRoot[key].length; i += 1) {
        const item = mapRoot[key][i];
        valueList.push(item.value);
        labelList.push(item.label);
      }

      const citys = this.renderChildrenList(valueList, labelList);
      myResult.push(<div key={key}>{key}{citys}</div>);
    });
    return myResult;
  }
  renderResultList() {
    const { mapRoot } = this.data.result;// valueList, labelList,

    console.log(mapRoot);

    const myResult = this.renderFirstLevel(mapRoot);
    console.log('myResult', myResult);
    return myResult;

  }

  render() {
    const { locale } = this.props;
    return (
      <div>
        <Button
          type={'outline'}
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          {i18n(locale).placeholder}
        </Button>
        {this.renderResult()}
        {this.renderDialog()}
      </div>
    );
  }

}

CascadeMultiModal.defaultProps = {
  className: '',
  prefixCls: 'yg-cascade-multi',
  config: [],
  options: [],
  cascadeSize: 3,
  value: [],
  notFoundContent: '',
  allowClear: true,
  locale: 'zh-cn',
  onSelect: () => { },
  showChildrenCheck: false,

  title: '',
  width: 0,
  onOk: () => { },
  onCancel: () => { },
};

CascadeMultiModal.propTypes = {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  config: PropTypes.array,
  options: PropTypes.array,
  cascadeSize: PropTypes.number,
  value: PropTypes.array,
  notFoundContent: PropTypes.string,
  allowClear: PropTypes.bool,
  locale: PropTypes.string,
  onSelect: PropTypes.func,
  showChildrenCheck: PropTypes.bool, // 是否显示子集详情,不被父级替代。默认为false

  title: PropTypes.string,
  width: PropTypes.number,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default CascadeMultiModal;
