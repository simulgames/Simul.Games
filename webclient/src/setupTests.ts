import '@testing-library/jest-dom/extend-expect'
import {act} from "@testing-library/svelte";

export async function MockSendMessage(header:string, body?:any){
    let invalidLobbyEvent = new CustomEvent(header,
        {bubbles:true,
            cancelable:false,
            composed:true,
            detail:body
        })
    await act(()=>{
        document.dispatchEvent(invalidLobbyEvent
        )})
}