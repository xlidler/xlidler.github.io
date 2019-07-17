var Category = /** @class */ (function () {
    function Category() {
        this.datas = [];
    }
    //获得初始化数据
    Category.prototype.getdefault = function () {
        var category = new Category();
        var s0 = "学习:考研,计算机,美术,文学;损失:交通,排队,等候;娱乐:游戏,影音,创作,社交,旅游;工作:常规,加班;生活:正餐,零食,锻炼,清洁,午休,晚修;其他:未知";
        var s1 = s0.split(";");
        for (i = 0; i < s1.length; i++) {
            var s2 = s1[i].split(":");
            category.addCategory(s2[0]);
            var s3 = s2[1].split(",");
            for (j = 0; j < s3.length; j++) {
                category.addCategory(s3[j], category.getIdByName(s2[0]));
            }
        }
        this.datas = category.datas;
    };
    Category.prototype.getIdByName = function (name) {
        return this.datas.find(function (value) { return value.name == name; }).id;
    };
    Category.prototype.getNameById = function (id) {
        return this.datas.find(function (value) { return value.id == id; }).name;
    };
    Category.prototype.getChildren = function (id) {
        if (id === void 0) { id = 0; }
        var result = this.datas.filter(function (value) { return value.pid == id; });
        var category = this;
        result.forEach(function (value) {
            value.children = category.getChildren(value.id, category);
        });
        return result;
    };
    Category.prototype.addCategory = function (name, pid) {
        if (pid === void 0) { pid = 0; }
        this.datas.push({
            name: name,
            pid: pid,
            id: this.datas.length + 1
        });
    };
    Category.prototype.altCategory = function (newname, id) {
        this.datas[this.datas.findIndex(function (value) { return value.id == id; })].name = newname;
    };
    //将该分类的pid改为-1
    Category.prototype.delCategory = function (id) {
        this.datas[this.datas.findIndex(function (value) { return value.id == id; })].pid = -1;
    };
    return Category;
}());
/*
let test = new Category();
test.getdefault()
test.altCategory("study", 1)
test.delCategory(1)
console.log(test.getChildren())
console.log(test.getIdByName("学校"));
*/
var Note = /** @class */ (function () {
    function Note(category) {
        if (category === void 0) { category = "default"; }
        this.datas = [];
        if (category == "default") {
            var category_1 = new Category();
            category_1.getdefault();
            this.category = category_1.datas;
        }
        else {
            this.category = category;
        }
    }
    Note.prototype.addNote = function (cid, mark, timestamp) {
        if (mark === void 0) { mark = ""; }
        if (timestamp === void 0) { timestamp = new Date().getTime(); }
        var note = {
            id: this.datas.length + 1,
            cid: cid,
            mark: mark,
            timestamp: timestamp
        };
        this.datas.push(note);
    };
    Note.prototype.altNote = function (id, cid, mark) {
        if (mark === void 0) { mark = ""; }
        var index = this.datas.findIndex(function (value) { return value.id == id; });
        this.datas[index].cid = cid;
        if (mark != "")
            this.datas[index].mark = mark;
    };
    Note.prototype.sortBy = function (a, b) {
        return a.timestamp - b.timestamp;
    };
    Note.prototype.sortByTime = function () {
        this.datas.sort(this.sortBy);
    };
    Note.prototype.getNodeById = function (id) {
        var index = this.datas.findIndex(function (value) { return value.id == id; });
        if (index > 0) {
            var pre = this.datas[index - 1];
        }
        else {
            var pre = this.datas[index];
        }
        var next = this.datas[index];
        var result = {};
        result.from = pre.timestamp;
        result.fromtime = this.formatDate(pre.timestamp);
        result.to = next.timestamp;
        result.totime = this.formatDate(next.timestamp);
        result.during = {
            hour: parseInt(((result.to - result.from) / 1000 / 3600 % 60)),
            minute: parseInt(((result.to - result.from) / 1000 / 60 % 60)),
            second: parseInt(((result.to - result.from) / 1000 % 60))
        };
        result.id = next.id;
        result.cid = next.cid;
        var cate = new Category();
        cate.datas = this.category;
        result.cname = cate.getNameById(next.cid);
        result.mark = next.mark;
        return result;
    };
    Note.prototype.getNodeByTime = function (from, to) {
        var result = [];
        var arr = this.datas.filter(function (value) { return value.timestamp > from && value.timestamp < to; });
        var note = this;
        arr.forEach(function (value) {
            result.push(note.getNodeById(value.id));
        });
        return result;
    };
    Note.prototype.formatDate = function (timestamp) {
        var timestamp = new Date(timestamp);
        var year = timestamp.getFullYear();
        var month = timestamp.getMonth() + 1;
        var date = timestamp.getDate();
        var hour = timestamp.getHours();
        var minute = timestamp.getMinutes();
        var second = timestamp.getSeconds();
        return {
            year: year,
            month: month,
            date: date,
            hour: hour,
            minute: minute,
            second: second
        };
    };
    return Note;
}());
/*
let category = new Category();
category.addCategory("学习")
//let note = new Note(category.datas);
let note = new Note();
var timestamp3 = new Date().getTime();
note.addNote(3, "", new Date().getTime())
note.addNote(2, "", new Date(timestamp3 + (3600 + 60*5+ 5 )* 1000).getTime());
note.addNote(4, "", new Date(timestamp3 - 2560 * 1000).getTime())
//note.altNote(1, 17)
console.log(note.getNodeByTime(new Date(timestamp3 - 100 * 1000).getTime(), new Date(timestamp3 + 3660 * 2000).getTime()));

*/
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.App = function () {
    };
    App.prototype.init = function () {
        this.note = new Note();
        var load = JSON.parse(localStorage.getItem('note'));
        if (load != null) {
            this.note.datas = load.datas;
            this.note.category = load.category;
        }
    };
    App.prototype.add = function (cid, mark, timestamp) {
        if (mark === void 0) { mark = ""; }
        if (timestamp === void 0) { timestamp = (new Date()).getTime(); }
        this.note.addNote(cid, mark, timestamp);
        this.note.sortByTime();
        localStorage.setItem('note', JSON.stringify(this.note));
    };
    App.prototype.alt = function (id, cid, mark) {
        this.note.altNote(id, cid, mark = "");
        localStorage.setItem('note', JSON.stringify(this.note));
    };
    App.prototype.getNote = function (from, to) {
        if (this.note.datas.length > 0) {
            from = this.note.datas[0].timestamp - 1000;
            to = this.note.datas[this.note.datas.length - 1].timestamp + 1000;
            return this.note.getNodeByTime(from, to);
        }
        else {
            return [];
        }
    };
    App.prototype.getCate = function () {
        var cate = new Category();
        cate.datas = this.note.category;
        return cate.getChildren();
    };
    App.prototype.upload = function () {
        var fileSelect = document.getElementById("fileSelect"), fileElem = document.createElement("input");
        fileElem.type = "file";
        fileElem.click();
        var note = this.note;
        fileElem.addEventListener('change', function () {
            var reader = new FileReader(); //新建一个FileReader
            reader.readAsText(fileElem.files[0], "UTF-8"); //读取文件 
            reader.onload = function (evt) {
                var fileString = evt.target.result; // 读取文件内容
                note.datas = JSON.parse(fileString).datas;
            };
        });
        localStorage.setItem('note', JSON.stringify(this.note));
    };
    App.prototype.download = function () {
        download(JSON.stringify(this.note), "dailynote.txt", "text/plain");
    };
    App.prototype.test = function () {
        var note = new Note();
        for (i = 9; i < 10000; i++) {
            var day = 1000 * 60 * 60 * 24;
            var timestamp = new Date().getTime();
            timestamp = timestamp - day * i;
            timestamp = timestamp + day * Math.round(Math.random() * 100) / 100;
            var cid = Math.round(Math.random() * 26) + 1;
            note.addNote(cid, "", timestamp);
        }
        this.note = note;
        this.note.sortByTime();
        localStorage.setItem('note', JSON.stringify(this.note));
    };
    App.prototype.test2 = function () {
        this.note.addNote(1);
    };
    App.Instance = new App();
    return App;
}());
/*class Abc{
    public constructor() {
        console.log("123");
    }
}
class BBB{
    do(){
        let abc = new Abc();
    }
}
let bbb= new BBB();
bbb.do();
*/ 
