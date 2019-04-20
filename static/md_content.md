> npm路径：C:\Users\syfxl\AppData\Roaming\npm\node_modules
> 本笔记目前只打算记录原生JS的知识，框架的学习打算另外撰写，主要是记录JS的精粹，毕竟JS是一个比较神奇的语言。

## JSO(JavaScript对象) and JSON
JSON是JavaScript Object Notation的简称，一种设计用来方便传递信息，可以轻松的从字符串形式转换为各种语言的对象形式，其中又以JavaScript和PHP最为方便



### JSO格式

```javascript
var data = {
	'one': 'one',
	'two': 'two',
	'three': function() {
		var test = 0;
	}
}
```
js对象的key一般为string，而value可以为普通的变量值，也可以为函数，当时函数必须为匿名函数，调用的时候使用key来调用，如上方的匿名对象可以这样调用
```javascript
data.three();
```

### JSO使用

```javascript
name['key']; // 数组方式使用
name.key;    // 对象形式使用
name['key'] = 'new_value';  // js数值更新，若该key存在则会替换，若不存在则会添加该项
```
jso也是和java类似的引用式的，但一个等于另外一个的时候，只是将引用赋给另一个变量

### JSON格式

```javascript
{"one":"one","two":"two"},{"three":"three"}
```

### JSO和JSON互转

```javascript
// JSON转JSO
var obj = JSON.parse(text);
// JSO转JSON
var text = JSON.stringify(obj);
```

### JSON传值方式

> 以PHP和JavaScript作为样例

#### 前端传后端

直接将js对象作为一个数据传送即可，浏览器会自动格式化为请求字符串

```javascript
var data = {
    name: "syfxlin",
    password: "123456"
};
$.ajax({
    type: "post",
    url: "upload.php",
    data: data,
    dataType: "html",
    success: function (response) {
        $('body').append(response);
    }
});
// 后端接受到的数据：name=syfxlin&password=123456
// var_dump($_POST);
// array (size=2)
//   'name' => string 'syfxlin' (length=7)
//   'password' => string '123456' (length=10)
```

也可以使用json来传值

```javascript
$.ajax({
    type: "post",
    url: "upload.php",
    contentType: "application/json; charset=utf-8", // 声明类型为json
    data: JSON.stringify(data), // 格式化为json string
    dataType: "html",
    success: function (response) {
        $('body').append(response);
    }
});
// 后端需使用phpinput取得json string
$json_data = file_get_contents('php://input');
// $json_data：{"name":"syfxlin","password":"123456"}
// 解析json
$obj = json_decode($json_data);
// 返回的是一个object，所以使用的时候是箭头调用
echo $obj->name;

```

#### 后端传前端

> 目前后端传给前端一般是使用json来传值

```javascript
$obj = [
    'name'=>'test',
    'pwd'=>'123'1
];
echo json_encode($obj);
class Test {
    public $name = 'test2';
    public $pwd = '123';
}
$obj2 = new Test();
echo json_encode($obj2);
// PHP可以直接对对象或者数组进行json encode
$.ajax({
    type: "post",
    url: "upload.php",
    data: "",
    dataType: "json",
    success: function (response) {
        console.log(response);
        console.log(response.name);
    }
});
// 前端收到数据后会直接将json string解析为js对象
```

## 循环控制
js大部分的循环都和java，PHP等类C语言的相同，只是foreach循环和其他语言不同
```javascript
var arr = ['1','2','3'];
for(var name in arr) {
	console.log(name);
}
```

## 函数

### 声明
js中的函数声明有两种方式，一种是普通的声明，一种是函数式声明，其中函数式声明在js中极为常用
```javascript
// 普通声明
function fun1() {
	console.log('fun1');
}
// 函数式声明
var fun2 = function() {
	console.log('fun2');
}
```

### 调用
js因为其是原型语言，所以它有多种调用模式，函数也可以认为是类，方法，函数，所以衍生出了函数调用，方法调用，构造器调用等多种调用模式
```javascript
// 方法调用
myclass.fun1();
// 函数调用
var num = add(1, 2);
// 构造器调用
var c = new Quo(1);
```

### 参数
js中在函数调用的时候会配送一个`arguments`的类数组参数，它没有数组的任何方法，但是有length属性
当调用时，解释器会将所有的参数存入该数组，而在函数中可以使用该数组提取参数，类似于可变参数
```javascript
var sum = function() {
	var i=0,sum=0;
	for(i=0;i<arguments.length;i++) {
		sum += arguments[i];
	}
	return sum;
}
console.log(sum(1,1,1,1,1,1,1));
// out: 7
```

### 返回值
js的返回值不同于其他语言，当return没有返回值的时候返回的是`undefined`，当使用类模式进行调用，则返回`this`(此this非彼this，这个this是新的对象)

## 异常处理
js同样支持异常处理，可以抛出异常和try-catch
```javascript
// 抛出异常
throw {
	name: 'a name',
	massage: 'a massage'
}
// 异常处理
try {
	add();
} catch(e) {
	console.log('error');
	console.log(e.name + e.massage);
}
```

## 变量作用域
js中也有变量的作用域，但是不同于其他语言，其作用域是在函数中生效的，函数外不可用，不支持块级作用域
```javascript
var fun = function() {
	var a = 1;
	for(var b=0;b<10;b++) {
		console.log(a + " " + b); //out: 1 xx(0-10)
	}
	console.log(a + " " + b); //out: 1 xx(0-10)
}
console.log(a + " " + b); //out: undefined undefined
```
js中没有私有的变量，但是可以通过模拟私有化来实现，即使用函数将变量和操作隔离开来
```javascript
const map = new WeakMap();
// 创建一个在每个实例中存储私有变量的对象
const internal = obj => {
  if (!map.has(obj)) {
    map.set(obj, {});
  }
  return map.get(obj);
}
class Shape {
  constructor(width, height) {
    internal(this).width = width;
    internal(this).height = height;
  }
  get area() {
    return internal(this).width * internal(this).height;
  }
}
const square = new Shape(10, 10);
console.log(square.area);      // 100
console.log(map.get(square));  // { height: 100, width: 100 }
```

## 闭包
```javascript
var quo = function(status) {
	return {
		get_status: function() {
			return status;
		}
	}
}
//创建一个quo实例
var myQuo = quo(1);
console.log(myQuo.get_status); //out: 1
```
虽然创建实例的时候就已经返回了，按照常规该方法应该是返回当前环境的status，但是却返回了定义get_status上下文中的status，其实这就是js闭包的特性，之前写项目的时候也遇到过这种情况，就是模拟toggle时使用到的select变量

## 回调
回调，即函数在函数执行成功时运行回调的函数，在ajax中经常使用
```javascript
$.ajax({
	...
	success: function() {
		console.log('success');
	}
});
```

## 模块
js中提供了模块的设计模式，可以类比为没有类变量，只有类方法的类，即在函数中嵌套多个函数，但是不在主函数中定义变量
```javascript
//有多种写法
var mod = function() {
	//第一种
	fun1: function() {
		console.log('fun1');
	}
}
```

## 继承
> 由于js是一门弱类型语言，不需要进行类型转换，所以继承关系变得不那么重要
> **对于一个对象来说重要的是它能做什么，而不是他从哪里来**
> 但是js是一种原型语言，可以模拟基于类的代码重用模式，也可以支持更多更具表现力的模式

### 对象说明符
> 记住构造器的参数是非常令人烦恼的，这时候js对象就能很好的解决这种问题，使用对象说明符的时候只需要记住参数的名字即可，无需分辨他是第几个参数
```javascript
//原始写法
var myObject = maker(a,s,d,f);
//魔改写法
var myObject = maker({
	a: a,
	s: s,
	d: d,
	f: f
});
```

## 原型
> 原型其实就可以认为是继承，但是其不能实现接口的功能，只能实现普通类继承的功能，但是，所有的对象都有个`__proto__`的属性，这个就可以认为是原型链的钩子，它可以将每个对象链接起来，形成类似于继承的原型链
> fun1->fun2->fun3->fun4
参考资料：[掘金-JS原型链与继承别再被问倒了](https://juejin.im/post/58f94c9bb123db411953691b)

## 数组
js中创建数组和PHP一样简单，都是相同的创建语法
```javascript
//创建数组
var arr = [1,2,3,4,5,6,7,8,9];
//创建对象
var obj = {
	'1': '1',
	'2': '2'
};
```
虽然数组和对象在console看起来极为相似，但是他们并不相同，数组继承至Array的原型链，而对象集成至Object的原型链，另外Array有length属性，而Object并没有length属性
> 在js中由于对象和数组极为相似，所以可以定义一个方法来判断是那种，基于typeof

## DOM
> 由于操作DOM会对性能产生不小的影响，所以要少用DOM操作（这句话是对后端渲染的有效，前端渲染还是要用到DOM）

js操作DOM常用的有5种，分别是
- getElementById(id) - object
- getElementByClassName(class) - object-array
- getElementByTagName(tag) - object-array
- getAttribute(attr) - string
- setAttribule(attr, value) - void

### 在html调用js方法
在html中调用js的函数一般采用onclick属性，若是a标签则可以使用href属性来调用
```html
<a href="javascript:fun();" onclick="fun()"></a>
<button onclick="fun();return false;"></button>
```
当onclick中返回了false浏览器则不会进行跳转操作，而是只执行js代码，但是一般也比较少返回false，而是不返回
在onclick中可以添加this参数用来传递调用该函数的html dom节点，而href不行，所以一般调用js函数使用的是onclick而不是href
要使a标签点击不跳转则需要将href改为javascript:void(0);

### 获取子节点

#### childNodes
dom对象上都有一个childNodes属性，用来返回该元素下所有的子元素，包括标签外的文本，一般不使用

#### children
类似于childNodes，但是children返回的是一个包含所有子节点的数组（有length属性），只包括标签的节点，最常用来获取某个子元素

#### innerHTML
js中有个古老的但挺实用的属性是innerHTML，它代表当前节点的子元素的string，即输出原始的html代码
当使用为其赋值的时候会覆盖原本的内容，所以若要进行添加操作的时候应使用别的方法，若是要将大量的html代码转换为dom的时候innerHTML就会比其他好用

#### createElement
用innerHTMl在动态添加html的时候会有局限性，相对的js也提供了直接创建dom元素的方法，createElement可以创建一个dom节点，对该节点进行操作，最后将其添加到dom树上
```javascript
//创建一个p标签节点
var testNode = document.createElement('p');
```

#### createTextNode
当要在某个标签中添加文字的时候createElement就派不上用场，除了使用innerHTML或者innerTEXT还能使用js的一个方法createTextNode
```javascript
//创建text节点
var text = document.createTextNode('Test');
//添加到节点中
pNode.appendChild(text);
```

#### appendChild
appendChild方法可以将一个dom节点添加到父节点的末尾
```javascript
parent.appendChild(child);
```
**js中并没有prependChild方法来从父节点的前面添加节点**

#### insertBefore
insertBefore可以将一个节点添加到指定节点的前方，但是需要提供父节点
```javascript
parentElement.insertBefore(newElement, targetElement);
```
和appenChild一样，并没有insertAfter，但是可以通过别的代码实现
```javascript
function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if(parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}
```

## 性能优化
在js中不同于编译性语言，编译性语言的编译器会针对一些代码进行优化，而解释型语言是即时解析的所以无法进行代码优化
```javascript
//将重复使用的js函数的返回值存入局部变量中，防止多次引用
var title = fun.getTitle();
```

由于js的解析器和dom的渲染器是分开的，两者的通讯需要通过API进行对接，所以会造成极大的性能浪费，所以在编写js代码的时候应避免多次进行dom操作
将要进行的dom操作合为一步，如要修改循环添加innerHTML的内容，应将内容临时存入变量中，随后在使用innerHTML将内容写入dom节点中
```javascript
function innerHTMLLoop() {
	var content = '';
	for(var i = 0;i<10;i++) {
		content += 'content';
	}
	document.getElementById('here').innerHTML += content;
}
```

在进行复杂的dom选择时使用querySelector，js要进行复杂的选择时普通的getid和getclass并不如selector，在进行复杂的选择时，selector的效率会比其他两个高，同时编写也相对简单，更容易阅读
```javascript
//selector方式
var ele = document.querySelectorAll('#menu a');
//普通方式
var ele = document.getElementById('menu').getElementByTagName('a');
```

当页面的样式被修改的时候会触发重绘或重排，若进行多重操作，则会导致触发多次重绘重排，导致性能浪费，所以应将多个操作合并处理，减少对页面的重绘重排
```javascript
//原始版本
var ele = document.getElementById('mydiv');
ele.style.borderLeft = '1px';
ele.style.borderRight = '1px';
//优化版本
var ele = document.getElementById('mydiv');
ele.style.cssText = 'border-left:1px;border-right:1px;'
```

减少对dom的访问一般是采用批量修改dom的方法进行实现，一般是使要修改的元素脱离文档，然后修改完成后恢复为文档中
**脱离文档一般有3种方法**
- 隐藏元素，应用修改，显示元素（display-none的元素修改不会触发重绘重排）
- 将该节点从dom文档树中脱离出来，修改后再添加或文档中
- 克隆该节点，然后对克隆的节点进行修改，最后添加回文档并覆盖
```javascript
var ele = document.getElementById('list');
ele.style.display = 'none';
ele.appendChild('...');
ele.style.display = 'block';
```

# React.js
> 之所以将React放在JS学习笔记之内，不像Spring和Java分开的原因是React不同于Spring那种巨型框架，前端框架都是比较简洁的，所以没有必要分开来

本部分将会把使用React中遇到的坑和一些注意事项写入该笔记，但是基础语法并不会写进这里，因为有完整的文档了，没必要再重写一遍

## JSX
JSX可以看作是React的一种模板语言，单与模板语言不同的是他是完全由JS实现的，它和html非常类似但是并不是html，更不是字符串，React在编译的时候会将JSX编译成JS

JSX的使用方式和html非常类似，但是因为 JSX 的特性更接近 JavaScript 而不是 HTML , 所以 React DOM 使用 camelCase 小驼峰命名 来定义属性的名称，而不是使用 HTML 的属性名称。
> 例如，class 变成了 className，而 tabindex 则对应着 tabIndex。

## 组件
组件，其实可以认为是JS函数或者JS ES6 class，使用的时候使用JSX来使用，类似于html的标签
```javascript
//函数组件
function Welcome(props) {
	return <h1>Hello, {props.name}</h1>;
}
//class组件
class Welcome extends React.Component {
	render() {
		return <h1>Hello, {this.props.name}</h1>;
	}
}
//组件渲染（使用）
ReactDOM.render(<Welcome name="World!" />, document.getElementById('root'));
```
组件使用的时候就跟平常的JSX组件类似，组件的属性或随props参数传进函数中或者随this.props传入class中
**另外需要注意：**组件名称必须以大写字母开头。否则在编译的时候将会被认为是DOM标签

组件也是可以使用点表示法的类似于ES6 class的点表示法
```javascript
const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  //可以通过点访问子组件
  return <MyComponents.DatePicker color="blue" />;
}
```

## Props对象
props是JSX组件的参数
如果你已经有了个 props 对象，并且想在 JSX 中传递它，你可以使用 ... 作为“展开(spread)”操作符来传递整个属性对象。下面两个组件是等效的：
```javascript
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
//将对象放到一个key的value中
var name = {
  name: "123",
  age: "456"
};
return (
  <div>
  <Test arr={name}><p>children</p></Test>
);
```
比起将要传入的对象放置在一个key的value中，这种直接放置在props中的属性会更加的方便，具体如何使用要具体分析

## State（状态）
React生命周期
![React生命周期](https://upload-images.jianshu.io/upload_images/4118241-d979d05af0b7d4db.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/488/format/webp)
在文档中的一个例子，可以很好的解释React的渲染过程
state的使用是配套的，有可能改变的或者将会改变的元素必须定义在`this.state`，更改使用`this.setState()`进行更改，否则在state改变的时候React将不会重新渲染
```javascript
//Clock组件，可以每秒更新一次
class Clock extends React.Component {
  //class构造器
  constructor(props) {
    super(props);
    //创建了一个时间类存入状态中
    this.state = {date: new Date()};
  }
  //当渲染完毕的时候调用
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  //组件卸载的时候清除状态
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  //设置状态的函数
  tick() {
    //**注意不能直接赋值**，直接赋值不会使组件更新
    this.setState({
      date: new Date()
    });
  }
  //渲染函数
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

## 事件处理
事件在React中指的是onclick事件，在JSX中应写为onClick，同时不能使用`return false`来阻止打开新页面，必须使用`preventDefault`来阻止新页面被打开，或者跳转锚点
```javascript
function ActionLink() {
  function handleClick(e) {
    //阻止href的跳转
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```
使用 React 的时候通常你不需要使用 addEventListener 为一个已创建的 DOM 元素添加监听器。你仅仅需要在这个元素初始渲染的时候提供一个监听器。
即在构造器函数中定义一个事件，将该事件绑定到this
```javascript
constructor(props) {
  super(props);
  this.state = {isToggleOn: true};
  // This binding is necessary to make `this` work in the callback
  this.handleClick = this.handleClick.bind(this);
}
```
必须谨慎对待 JSX 回调函数中的 this，类的方法默认是不会绑定 this 的。如果你忘记绑定 this.handleClick 并把它传入 onClick, 当你调用这个函数的时候 this 的值会是 undefined。即若不绑定this，那就无法获得当前类的状态和元素

## 条件处理
条件处理就是流程控制啦，即if switch等
简单的demo，将上方的功能结合在一起的demo
```javascript
class LoginController extends React.Component {
  constructor(props) {
    super(props);
    //构建组件的必须元素
    this.state = {
      isLogin: false
    };
    this.LoginClick = this.LoginClick.bind(this);
    this.LogoutClick = this.LogoutClick.bind(this);
  }
  //onclick事件
  LoginClick() {
    this.setState({
      isLogin: true
    });
  }
  //onclick事件
  LogoutClick() {
    this.setState({
      isLogin: false
    });
  }
  render() {
    //条件处理必须在外面处理，不能在return中处理，return中一般只写返回，即要渲染的组件，将条件处理的结果存入变量中，然后在返回中调用
    let button = null;
    if(this.state.isLogin === true) {
      button = <button onClick={this.LogoutClick}>Logout</button>;
    } else {
      button =  <button onClick={this.LoginClick}>Login</button>;
    }
    let welcome = null;
    if(this.state.isLogin === true) {
      welcome = <p>Welcome,You are Login!</p>;
    } else {
      welcome = <p>Sorry,You should Login!</p>;
    }
    return (
      <div>
        {welcome}
        {button}
      </div>
    );
  }
}
```
也可使用与运算符`&&`，在JSX的返回中，与运算符并不是与的意思，而是控制是否显示的意思
```javascript
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      //当&&左边的判断为true的时候右边的元素就会被渲染，若为false，右边的元素就不会被渲染
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}
```
在JSX中也可以使用三目运算符，可以代替if，但是不太直观，一般只用来显示文字

## 列表
其实可以认为是循环结构，只不过前端的循环一般是用来生成列表的
下面是生成列表的简单又是极为方便的方式，即使用map方法
```javascript
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>{number}</li>
);
//这时listItems就是带有5个li的元素了，编译时会生成列表
```
列表可以放置在渲染组件上，即return中，但是需要同jsx引用js一样用大括号包起来
```javascript
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />

      )}
    </ul>
  );
}
```
### Key
Keys可以在DOM中的某些元素被增加或删除的时候帮助React识别哪些元素发生了变化。因此你应当给数组中的每一个元素赋予一个确定的标识。一个元素的key最好是这个元素在列表中拥有的一个独一无二的字符串。
Key不会影响到View的任何部分，**注意：**Key是用来辅助React渲染数组的，元素的key只有放在其环绕数组的上下文中才有意义。不应该放置到其他位置
```javascript
<li key={number.toString()}>{number}</li>
```

## 表单
### 受控组件
`<input>`,`<textarea>`, 和 `<select>`是可控的控件，其值由React控制的输入表单元素称为“受控组件”，若未设置state和表单变化的操作则表单无法进行填写，与普通的控件不同，普通的控件是浏览器控制的，而受控控件是React控制的，由React来控制控件的变化，包括输入的变化
上面三种控件若填写的 `value` 属性则变为受控控件，此时就需要填写变化时更新值的逻辑
```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```
若没有设置`handleChange`则受控控件在用户输入的时候不会更新value

由于file input 标签是只读的，所以该控件不是受控控件

### 非受控控件
非受控控件，就是不由React管理的表单控件，由于非受控组件将真实数据保存在 DOM 中，因此在使用非受控组件时，更容易同时集成 React 和非 React 代码。如果你想快速而随性，这样做可以减小代码量。否则，你应该使用受控组件。
当 `value` 属性则变为受控控件，为了设置默认值，应该使用`defaultChecked`和`defaultValue`来设置默认值
但是设置后React要获取控件的就需要使用ref
```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

## 组合 & 继承
### 包含关系
有的时候并不知道一个组件的子组件是什么，所以就需要传递子组件，传递子组件需要使用`props.children`来获取子组件
**注：**子组件就是包含在组件标签中的内容，类似于DOM中的ele.children
```javascript
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      //填充传递进来的子组件
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      //子组件 - start
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
      //子组件 - end
    </FancyBorder>
  );
}

ReactDOM.render(
  <WelcomeDialog />,
  document.getElementById('root')
);
```
还有一些不太常见的操作，比如多个子组件
```javascript
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```
### 继承
继承一般不需要，继承的部分一般可以使用组合来代替