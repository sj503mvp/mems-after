const { Controller } = require('egg');

class HomeController extends Controller {
    async index() {
        const { ctx, app } = this;
        ctx.body = ctx.state.user;
    }

    async getHomePieData() {
        const { ctx, app } = this;
        const type = ctx.query.type;
        if(type == 'ascription') {
            try {
                const results = await app.mysql.query(
                    'SELECT ownFactoryId, COUNT(*) as count FROM device GROUP BY ownFactoryId'
                )
                const factoryMap = {  
                    '1' : '总部',  
                    '2' : '华东冶炼一厂',  
                    '3' : '华南轧制二厂',  
                    '4' : '华东连铸三厂',  
                    '5' : '华北冶炼四厂',  
                    '6' : '华南冶炼五厂',  
                };
                let seriesData = results.map(item => {  
                    const ownfactory = factoryMap[item.ownFactoryId];  
                    return {  
                        value: parseInt(item.count) || 0,  
                        name: ownfactory  
                    };  
                });
                seriesData = seriesData.filter(item => item.value > 0)
                ctx.body = {
                    code: 200,
                    data:{
                        title: {
                            text: '各厂区设备数',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            orient: 'horizontal',
                            left: 'left',
                            top: 'bottom'
                        },
                        series: [{
                            name: '设备数量',
                            type: 'pie',
                            radius: '70%',
                            data: seriesData,
                            emphasis: {
                                itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    }
                }
            }catch(error) {
                ctx.logger.error(error);
                ctx.body = { 
                    msg: '服务器错误'
                };
                ctx.status = 500;
            }
        }else {
            try {
                const results = await app.mysql.query(
                    'SELECT status, COUNT(*) as count FROM device GROUP BY status'
                )
                const statusMap = {
                    '1' : '正常',
                    '2' : '异常',
                    '3' : '维修中',
                    '4' : '待确认',
                    '5' : '报废',
                }
                let seriesData = results.map(item => {  
                    const statusName = statusMap[item.status];
                    return {  
                        value: parseInt(item.count) || 0,  
                        name: statusName  
                    };
                }); 
                seriesData = seriesData.filter(item => item.value > 0)
                ctx.body = {
                    code: 200,
                    data:{
                        title: {
                            text: '全部设备状态',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            orient: 'horizontal',
                            left: 'left',
                            top: 'bottom'
                        },
                        series: [{
                            name: '设备状态',
                            type: 'pie',
                            radius: '70%',
                            data: seriesData,
                            emphasis: {
                                itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    }
                }
            }catch(error) {
                ctx.logger.error(error);
                ctx.body = { 
                    msg: '服务器错误'
                };
                ctx.status = 500;
            }
        }
    }

    async getAllDeviceInfo() {
        const { ctx, app } = this;
        try {
            const results = await app.mysql.query(
                'SELECT DATE_FORMAT(STR_TO_DATE(buyTime, \'%Y-%m-%d %H:%i:%s\'), \'%Y-%m\') AS month, COUNT(*) AS count ' +  
                'FROM device ' +  
                'GROUP BY DATE_FORMAT(STR_TO_DATE(buyTime, \'%Y-%m-%d %H:%i:%s\'), \'%Y-%m\') ' +  
                'ORDER BY month' 
            )
            let cumulativeCounts = [0];  
            results.forEach(result => {  
                const currentCount = parseInt(result.count);  
                cumulativeCounts.push(cumulativeCounts[cumulativeCounts.length - 1] + currentCount);  
            });  
            cumulativeCounts.shift();
            const echartsData = {
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: results.map(result => result.month)
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: cumulativeCounts,
                        type: 'line',
                        areaStyle: {}
                    }
                ]
            }
            ctx.body = {
                code: 200,
                data: echartsData,
            }
        }catch(error) {
            ctx.logger.error(error);
            ctx.body = { 
                msg: '服务器错误'
            };
            ctx.status = 500;
        }
    }
}

module.exports = HomeController;