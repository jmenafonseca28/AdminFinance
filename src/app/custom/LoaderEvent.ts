import { EventsNames } from "../constants/EventsNames";

export const LoaderEvent = (id: string, quit = false) => {
    return !quit ? new CustomEvent(EventsNames.LOADER, { detail: { id } }) : new CustomEvent(EventsNames.QUIT_LOADER, { detail: { id } });
};