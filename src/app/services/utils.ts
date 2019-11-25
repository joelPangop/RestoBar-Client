export class Utils {

    public static deleteItemFromArray(arr: any[], item: any) {
        const index = arr.indexOf(item, 0);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

}
