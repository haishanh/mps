## Usage


```js
const config = {
  onLoad() {
    console.log('this is a MP page');
  }
};


const mapStateToData = state => {
  // state is the global state
  return {
    name: state.name
  }
};

Page(connectPage(mapStateToData)(config));
```


## Other Solutions

- [Tencent/westore]:(https://github.com/Tencent/westore)
