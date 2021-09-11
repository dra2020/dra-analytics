// Don't export anything from utils

// export
// {
//   ...
// } from '../utils/all';

// A noop so the import so this is considered a module
type Noop = () => void;
// tslint:disable-next-line:no-empty
export const noop: Noop = () => { };