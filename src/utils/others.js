// 其他工具类

class Func {
  getDateTime() {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const strDate = date.getDate().toString().padStart(2, '0');
    const starHours = date.getHours().toString().padStart(2, '0');
    const starMinutes = date.getMinutes().toString().padStart(2, '0');
    const starSeconds = date.getSeconds().toString().padStart(2, '0');
    return `${date.getFullYear()}-${month}-${strDate}T${starHours}:${starMinutes}:${starSeconds}`;
  }
  
  clearObj(obj) {
    for (let item in obj) {
      if (Array.isArray(obj[item])) {
        obj[item] = [];
      } else {
        obj[item] = null;
      }
    }
  }
}

export default new Func();