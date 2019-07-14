import React from 'react';
import CascadeMultiSelect from './CascadeMultiSelect';
// import '../src/CascadeMultiSelect.less';
import logo from './logo.svg';
// import '~ygd/dist/ygd.less';

import './CascadeMultiSelect.less';

import './App.css';

import {
  province,
  options,
  // options2,
  // options3,
} from './const';

const dynamicData = [
  {
    value: 1,
    label: 'one',
    children: [
      {
        value: 2,
        label: 'two',
        children: [{
          value: 3,
          label: 'three',
          children: [{
            value: 4,
            label: 'four',
          }],
        }],
      },
    ],
  },
];

const {
  CascadeMultiPanel,
  CascadeMultiModal,
} = CascadeMultiSelect;

const size = '';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      demo1: ['zhejiang'],
      demo2: [],
      demo3: ['xihu'],
      demo4: ['bingjiang', 'ningbo', 'jiangsu'],
      demo5: ['bingjiang', 'ningbo', 'anhui', 'shandong'],
      demo6: ['xihu', 'bingjiang', 'shandong'],
      demo7: [],
      demo8: [],
      demo9: [287374],
      demo10: ['ningbo', 'yiwu', 'nanjing', 'jinan', 'longname-0-0'],
      asyncOptions6: options,
      dynamicData,
      dynamicOptions: [],
      size,
    };
  }

  render() {
    return (
      <div>

        <div style={{ marginLeft: 20 }}>
          <h3>弹框模式</h3>
        </div>
        <div style={{ position: 'relative', margin: 15, width: 300 }}>
          <CascadeMultiModal
            className={'ucms-modal'}
            title="选择区域"
            options={province}
            isCleanDisabledLabel
            value={this.state.demo10}
            cascadeSize={2}
            showChildrenCheck={true}
            size={'small'}
            onOk={(valueList, labelList, leafList) => {
              console.log(valueList, labelList, leafList);
              this.setState({ demo10: valueList });
            }}
          />
        </div>
      </div>
    );
  }
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }


// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       dynamicData,
//     };
//   }

//   render() {
//     const { dynamicData } = this.state;
//     return (
//       <div className="App">
//         <div style={{ margin: 15 }}>
//           <h3>动态</h3>
//         </div>
//         <div style={{ margin: 15, width: 200 }}>
//           <CascadeMultiSelect
//             options={dynamicData}
//             onOk={(...params) => console.log('onOk', params)}
//             onChange={(...params) => console.log('onChange', params)}
//             cascadeSize={4}
//             onItemClick={(s, level) => {
//               if (level === 3) {
//                 const newData = dynamicData.concat([]);
//                 newData[0].children[0].children[0].children = [{ value: 5, label: 'five' }];
//                 this.setState({ dynamicData: newData }, () => {
//                   // console.log(this.state.dynamicData);
//                 });
//               }
//             }}
//           />
//         </div>
//       </div>
//     );
//   }
// }


export default App;
