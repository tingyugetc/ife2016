
var queueData = [];

var Queue = function(queueData) {

    // 初始化类变量
    this.arr = queueData;

    // 入队
    this.inQueue = function (type, num) {
        switch (type) {
            case 'left':
                this.arr.unshift(num);
                break;
            case 'right':
                this.arr.push(num);
                break;
        }
        this.render();
    }

    // 出队
    this.outQueue = function (type, index) {
        var num;
        switch (type) {
            case 'left':
                num = this.arr.shift();
                break;
            case 'right':
                num = this.arr.pop();
                break;
            case 'middle':
                num = this.arr.splice(index, 1);
                break;
        }
        alert(num);
        this.render();
    }

    // 渲染页面
    this.render = function () {
        var queueNode = document.getElementById('queue');
        queueNode.innerHTML = '';
        for (var i = 0; i < this.arr.length; i++) {
            var node = document.createElement('div');
            node.setAttribute('class', 'queue-node');
            node.setAttribute('data-index', i);
            var text = document.createTextNode(this.arr[i]);
            node.appendChild(text);
            var self = this;
            node.addEventListener('click', function () {
                var index = this.getAttribute('data-index');
                self.arr.splice(index, 1);
                self.render();
            });
            queueNode.appendChild(node);
        }
    }

}

function addClickEvent(queue) {
    var inputButton = document.getElementsByTagName('input');

    for (var i = 1; i < inputButton.length; i++) {
        inputButton[i].addEventListener('click', function () {
            var action = this.name;
            var value = inputButton[0].value;
            switch (action) {
                case 'leftinto':
                    queue.inQueue('left', value);
                    break;

                case 'rightinto':
                    queue.inQueue('right', value);
                    break;

                case 'leftout':
                    queue.outQueue('left');
                    break;

                case 'rightout':
                    queue.outQueue('right');
                    break;
            }
        });
    }

}


// 初始化函数
function init() {
    // 初始化队列对象
    var queue = new Queue(queueData);
    // 添加事件监听
    addClickEvent(queue);
}

init();
