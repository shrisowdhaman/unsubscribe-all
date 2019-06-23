
# Unsubscribe All  #

Angular - Unsubscribe all Subscribed observable on ngDestroy using decorator @UnsubscribeAll()

The subscriber do occupy space in memory and should be released (unsubscribe) of their space once we are done using them. @Unsubscribeall() release all memory once navigate out from the component.
 
## Installation

$ npm install -g unsubscribe-all 

## Usage

```js
@UnsubscribeAll() // Call on ngDestory unsubscribe all subscribe observable
@Component(){}
export class TestComponent implements OnInit OnDestroy {

private subscribe: Subscription;
   constructor(private testService: TestService) { }

  ngOnInit() {
    this.subscribe = this.testService.callService().subscribe( res => {
      console.log(res);
    })
  }

  ngOnDestory{}
}
```
