import { Subject } from 'rxjs';

const changeHandler = new Subject();

export function useChangeHandler() {
    return { changeHandler }
}