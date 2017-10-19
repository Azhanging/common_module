/*
 *  layer-date 日期选择模块 
 * 
 *  绑定的class为config.elem
 *  设置最小时间为 minName的属性，这里的属性内部需要写符合js的代码
 *  设置最大时间为 maxName的属性，这里的属性内部需要写符合js的代码
 * 
 * */
(function() {

    var config = {
        format: 'yyyy-MM-dd',
        elem: '.laydate-elem', //绑定时间的节点

        formatName: 'data-format', //绑定时间格式属性
        minName: 'data-min', //绑定最小时间格式属性
        maxName: 'data-max',
        typeName: 'data-type',
        rangeName: 'data-range'
    };

    var configed = false;

    function LayDate() {

        if(configed) return ctx;

        if(this.constructor !== LayDate) {
            return new LayDate();
        }

        $.date.ctx = this;

        init.call(this);
    }

    function init() {

        var elem = $(config.elem),
            i = 0;

        elem.each(function(index, el) {

            var _config = $.extend(true, {}, config),
                $this = $(el),
                val = '';

            //配置信息
            _config['format'] = $this.attr(_config.formatName) || _config.format;

            configHandler.call(this, $this, _config, [{
                name: 'min',
                configName: 'minName'
            }, {
                name: 'max',
                configName: 'maxName'
            }, {
                name: 'type',
                configName: 'typeName'
            }, {
                name: 'range',
                configName: 'rangeName'
            }]);

            _config['elem'] = el;

            //处理初始化
            (function(config) {
                laydate.render(config);
            })(_config);
        });
    }

    /*处理配置信息*/
    function configHandler(ctx, config, configData) {

        configData.forEach(function(item, index) {

            config[item.name] = fn(ctx.attr(config[item.configName])) || false;

            if(config[item.name] == false) delete config[item.name];
        });

    }

    function fn(hander) {
        return new Function('return ' + hander)();
    }

    LayDate.prototype.getDate = function(format) {

        var formatType = format.trim().split(' '),
            hasTime = (formatType.length == 2);  
        
        var date = new Date(),
            date0 = [],
            date1 = [];

        var formatDate = formatType[0].split('-'),
            y = formatDate[0],
            m = formatDate[1],
            s = formatDate[2];

        date0.push(
            y ? date.getFullYear() : null,
            m ? date.getMonth() + 1 : null,
            s ? date.getDate() : null
        );

        //存在时间才处理
        if(hasTime){
            var time = formatType[1].split(':'),
                hh = time[0],
                mm = time[1],
                ss = time[2];
                
            date1.push(
                hh ? date.getHours() : null,
                mm ? date.getMinutes() : null,
                ss ? date.getSeconds() : null
            );
        }

        return (clearArr(date0).join('-') + ' ' + clearArr(date1).join(':')).trim();

    }
    
    function clearArr(arr){
        arr = arr.filter(function(item){
           return item != null && item != undefined;
        });
        return arr;
    }

    $.date = LayDate;

})($ || jquery);