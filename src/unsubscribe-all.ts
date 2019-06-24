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

export function UnsubscribeAll({
  blackList = [],
  arrayName = "",
  event = "ngOnDestroy"
} = {}) {
  return function(target: Function) {
    const original = target.prototype[event];

    if (!isFunction(original)) {
       console.warn(`${target.name} is using @UnsubscribeAll but has not declared ${event}`);
      throw new Error(
        `${
          target.name
        } is using @AutoUnsubscribe but does not implement OnDestroy`
      );
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
