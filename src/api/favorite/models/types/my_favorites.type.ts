import { mapReservableItem, ReservableListItem } from "src/api/reservable/models/types/reservable_list_item";
import { mapSideOrderItem, SideOrderListItem } from "src/api/sideorders/models/types/sideorder_list_item.type";
import { Favorite } from "../schemas/favotire.schema";
import { SideOrder } from "src/api/sideorders/models/schema/sideorder.schema";
import { Reservable } from "src/api/reservable/models/schemas/reservable.schema";
import { retry } from "rxjs";

export type MyFavorites = {
    sideOrders: SideOrderListItem[],
    services: ReservableListItem[],
};
export const mapMyFavorites = (favs:Favorite[]):MyFavorites=>{
    let myFav:MyFavorites = {
        services:[],
        sideOrders:[],
    };
    for (let i = 0; i < favs.length; i++) {
        const fav = favs[i];
        if(fav.serviceId){
            myFav.services.push(mapReservableItem(fav.serviceId as Reservable))
        }
        if(fav.sideOrderId){
            myFav.services.push(mapSideOrderItem(fav.sideOrderId as SideOrder))
        }

    }
    return myFav;
}