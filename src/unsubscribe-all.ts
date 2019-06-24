#!/usr/bin/env node
'use strict';
const isFunction = fn => typeof fn === "function";

const doUnsubscribe = subscription => {
  subscription &&
    isFunction(subscription.unsubscribe) &&
    subscription.unsubscribe();
};

const doUnsubscribeIfArray = subscriptionsArray => {
  Array.isArray(subscriptionsArray) &&
    subscriptionsArray.forEach(doUnsubscribe);
};

export function Unsubscribeall({
  blackList = [],
  arrayName = "",
  event = "ngOnDestroy"
} = {}) {
  return function(target: Function) {
    const original = target.prototype[event];

    if (!isFunction(original)) {
      // Throws the Error when NgDestory no declared in the component
      throw new Error(
        `${
            target.name
        } is using @UnsubscribeAll but does not implement OnDestroy`
      );

      console.warn(`${target.name} is using @UnsubscribeAll but has not declared ${event}`);
    }

    target.prototype[event] = function() {
      if (arrayName) {
        doUnsubscribeIfArray(this[arrayName]);
        isFunction(original) && original.apply(this, arguments);
        return;
      }

      for (let propName in this) {
        if (blackList.includes(propName)) continue;

        const property = this[propName];
        doUnsubscribe(property);
      }

      isFunction(original) && original.apply(this, arguments);
    };
  };

  
}
