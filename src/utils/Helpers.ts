class Helpers {

  checkArrayOfStrings(arr: any[]) {
    /* Helper function to check if all items from array are of type 'string' */
    for (let item of arr) {
      if (typeof item !== 'string') {
        return false;
      }
    }
    return true;
  }

}

export default Helpers;