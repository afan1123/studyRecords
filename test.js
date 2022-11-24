function format() {
  let qs = location.search.length > 0 ? location.search.substring(1) : '';
  let args = {};
  let keyValList = qs.split('&');
  keyValList.split('=').map((item) => {
    args[item[0]] = item[1];
  });
  return args;
}
