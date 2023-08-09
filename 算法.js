// 最大子数组之和
var maxSubArray = function (nums) {
  let ans = nums[0];
  let sum = 0;
  for (const num of nums) {
    if (sum > 0) {
      sum += num;
    } else {
      sum = num;
    }
    ans = Math.max(ans, sum);
  }
  return ans;
};
// 大数相加
let a = '9876543210123456789000000000123';
let b = '1234567898765432100000012345678901';
function add(str1, str2) {
  // 获取两个数字的最大长度let
  maxLength = Math.max(str1.length, str2.length);
  // 用0补齐长度，让它们两个长度相同
  str1 = str1.padStart(maxLength, 0);
  // "0009876543210123456789000000000123"
  str2 = str2.padStart(maxLength, 0);
  // "1234567898765432100000012345678901"
  let temp = 0;
  // 每个位置相加之和
  let flag = 0;
  // 进位：相加之和如果大于等于10，则需要进位
  let result = '';
  for (let i = maxLength - 1; i >= 0; i--) {
    // 获取当前位置的相加之和：字符串1 + 字符串2 + 进位数字
    temp = parseInt(str1[i]) + parseInt(str2[i]) + flag;
    // 获取下一个进位
    flag = Math.floor(temp / 10);
    // 拼接结果字符串
    result = (temp % 10) + result;
  }
  if (flag === 1) {
    // 如果遍历完成后，flag还剩1，说明两数相加之后多了一位，类似于：95 + 10 = 105
    result = '1' + result;
  }
  return result;
}
