import { AnyAction } from 'redux';

// type Matchable
type Matchable<AC extends () => AnyAction> = AC & {
  type: ReturnType<AC>['type'];
  match(action: AnyAction): action is ReturnType<AC>;
};

// create the actual withMatcher utility function that receives some action creator
// in order to create a new Matchable type out of that action creator

// overload actionCreators with no parameters and return back an action of AnyAction
// and we know this AnyAction's type is always going to be a string
// this function withMatcher is gonna receive a actionCreator function as argument
// and the actionCreator is going to be the AC generic type we pass into
// and it returns a Matchable object of that generic type AC
export function withMatcher<AC extends () => AnyAction & { type: string }>(
  actionCreator: AC
): Matchable<AC>;

// overload actionCreators has parameters and return back an action of AnyAction
// use rest parameters syntax to concatenate all the argument into an array
// and this array values can be any type
// this function still returns AnyAction and the type is also going to be a string
// this function withMatcher is gonna receive a actionCreator function as argument
// and the actionCreator is going to be the AC generic type we pass into
// and it returns a Matchable object of that generic type AC
export function withMatcher<
  AC extends (...args: any[]) => AnyAction & { type: string }
>(actionCreator: AC): Matchable<AC>;

// the actual function implementation
// use generic function because we already overload to have some safeguard type checks
export function withMatcher(actionCreator: Function) {
  // invoke the actionCreator, get the action object, then get its type value
  // and save it to the variable type
  const type = actionCreator().type;

  // use Object.assign to copy all the
  return Object.assign(actionCreator, {
    type,
    // the match function receives an action that can be AnyAction
    // and it checks the action type of this passed in action is equal to the type or not
    match(action: AnyAction) {
      return action.type === type;
    },
  });
}

// action with payload
export type ActionWithPayload<T, P> = {
  type: T;
  payload: P;
};

// action without payload
export type Action<T> = {
  type: T;
};

// function overloading: TypeScript concept
// provides the ability to make multiple function type definition of the same name
// It can return different types depending on the parameter types that received
// must be written in classic function declaration style function func() {}
// must have the same number of parameters for overloading, use void for no such argument

// overloading the type
// if the function gets called with a type and a payload
// the return type of this function should be ActionWithPayload
export function createAction<T extends string, P>(
  type: T,
  payload: P
): ActionWithPayload<T, P>;

// overloading the type
// if the function gets called with just a type
// the return type of this function should be Action
export function createAction<T extends string>(
  type: T,
  payload: void
): Action<T>;

// function implementation
export function createAction<T extends string, P>(type: T, payload: P) {
  return { type, payload };
}
