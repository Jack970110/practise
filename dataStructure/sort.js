function bubbleSort(arr){ 
    for(var i = 0; i < arr.length - 1; i++){
        //每一轮比较的次数
        for(var j = 0; j < arr.length - (i + 1); j++){
            if(arr[j] > arr[j + 1]){
                //交换两个数位置
                var tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
            }
        }
    }
}


function changeSortAsc(arr){ //升序
    for(var i = 0; i < arr.length - 1; i++){
        //被比较的数的下标
        for(var j = i + 1; j < arr.length; j++){
            if(arr[i] > arr[j]){
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
        }
    }
}


function insertSort(arr){
    for(var i=0;i<arr.length;i++){
        var key=arr[i];
        var j=i-1;
        while(j>=0&&arr[j]>key){
            arr[j+1]=arr[i];
            j--;
        }
        arr[j+1]=key;
    }
    return arr;
}


function mergeSort ( array ) {
    var len = array.length;
    if( len < 2 ){
        return array;
    }
    var middle = Math.floor(len / 2),
    left = array.slice(0, middle),
    right = array.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right)
{
var result = [];
while (left.length && right.length) {
    if (left[0] <= right[0]) {
        result.push(left.shift());
    } else {
        result.push(right.shift());
    }
}
while (left.length)
result.push(left.shift());
while (right.length)
result.push(right.shift());
return result;
}


function quickSort(arr){
    if(arr.length==0){
        return [];
    }
    var left=[];
    var right=[];
    var pivot=arr[0];
    for(var i=0;i<arr.length;i++){
        if(arr[i]<pivot){
        left.push(arr[i]);
        }
        else{
        right.push(arr[i]);
        }
    }
    return quickSort(left).concat(pivot,quickSort(right));
}
function quickSort(arr){
    if (arr.length <= 1) { 
        return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++){
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot], quickSort(right));
}