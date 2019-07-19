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
    const { value, options } = props;
    const { cityLength } = this.resetMap(value, options);
    this.state = {
      value: props.value,
      options: props.options,
      visible: false,
      expand: true,
      cityLength: cityLength,
      result: {},
      selectedNums: 0,
    };
    this.data = {
      value: props.value,
      options: props.options,
      result: {},
    };

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
    // this.initResult(valueList, leafList);
    // valueList 做为value ,再找一个options
    const { options } = this.props;
    const { cityLength } = this.resetMap(valueList, options);
    // console.log(cityLength, 'cityLength');
    // console.log(valueList, labelList, leafList, 'onselect');
    this.setState({
      value: valueList,
      cityLength: cityLength,
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

  resetMap = (value, options) => {
    const keyArr = [];
    const textArr = [];
    const valueList = deepcopy(value);

    const mapRoot = {};
    for (let key of options) {
      mapRoot[key.label] = [];
    }
    const { showChildrenCheck } = this.props;

    const isTop = showChildrenCheck;// 顶级不处理

    this.getSelectResult(valueList, options, keyArr, textArr, null, mapRoot, isTop);
    // console.log(mapRoot);
    return { cityLength: this.getSelectNums(mapRoot), keyArr: keyArr, textArr: textArr, mapRoot: mapRoot };
  }

  initResult(value, options) {
    const myMap = this.resetMap(value, options);

    this.data.value = myMap.keyArr;
    this.data.result = {
      cityLength: myMap.cityLength,
      mapRoot: myMap.mapRoot,
      valueList: myMap.keyArr,
      labelList: myMap.textArr,
    };

  }

  renderDialog() {
    const { prefixCls, locale, title, cascadeSize, cascadeWidth, width } = this.props;
    const { visible, cityLength } = this.state;
    if (!visible) { return null; }
    // 设置 dialog 默认宽度
    const defaultWidth = width || cascadeSize * cascadeWidth + 2;

    const footer = (
      <React.Fragment>
        <div className="w50 tl">
          <span>
            已选择
          </span>
          <span className="selectedNum">
            {!!cityLength && `${cityLength}`}
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
    const { cascadeSize, cascadeWidth, checkColor } = this.props;
    return (
      <div>
        <CascadeMultiPanel
          {...this.props}
          value={value}
          options={options}
          onSelect={(valueList, labelList, leafList) => {
            this.onSelect(valueList, labelList, leafList);
          }}
          cascadeSize={cascadeSize}
          cascadeWidth={cascadeWidth}
          allowRenderResult={false}
          checkColor={checkColor}
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

    if (!labelList) { return null; }
    const arr = [];

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
      >
        {arr}
      </ul>
    );
  }
  getSelectNums = (mapRoot) => {
    let cityLength = 0;
    Object.keys(mapRoot).forEach((key) => {

      cityLength += mapRoot[key].length;

    });
    return cityLength;
  }
  renderFirstLevel = (mapRoot) => {
    const myResult = [];
    // const that = this;
    Object.keys(mapRoot).forEach((key) => {

      let valueList = [];
      let labelList = [];
      const cityLength = mapRoot[key].length;
      if (cityLength > 0) {
        for (let i = 0; i < cityLength; i += 1) {
          const item = mapRoot[key][i];
          valueList.push(item.value);
          labelList.push(item.label);
        }

        const citys = this.renderChildrenList(valueList, labelList);
        myResult.push(<div key={key}>{`${key}(${cityLength})`}{citys}</div>);
      }
    });
    return myResult;
  }
  renderResultList() {
    const { mapRoot } = this.data.result;// valueList, labelList,
    const { expand } = this.state;
    const style = {
      height: expand ? 'auto' : 76,
      overflow: expand ? 'auto' : 'hidden',
    };

    const myResult = this.renderFirstLevel(mapRoot);
    // console.log('myResult', myResult);
    return (<div style={style}>{myResult}</div>);

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
