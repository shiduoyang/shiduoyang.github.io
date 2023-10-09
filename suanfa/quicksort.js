function quickSort(arr, l, r) {
    if (l >= r) return;
    let m = partition(arr, l, r);
    quickSort(arr, l, m - 1);
    quickSort(arr, m + 1, r);
}

function partition(arr, l, r) {
    let v = arr[l];
    let j = l;
    for (let i = l + 1; i <= r; i++) {
        if (arr[i] < v) {
            swap(arr, j + 1, i);
            j++;
        }
    }
    swap(arr, l, j);
    return j;
}

function swap(arr, i, j) {
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
}

let arr = [5, 4, 3, 2, 1];
quickSort(arr, 0, arr.length - 1);
console.log(arr);
