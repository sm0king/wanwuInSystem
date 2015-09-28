/*
数据请求模块。 主要进行数据请求
*/
'use strict';
//加载配置模块。
requirejs.config({
    baseUrl: '/js',
    paths: {
        'config': 'config',
    }
});
require(['config'], function() {
    define(['jquery'], function($) {
        //加载jquery进来。
        //关于api接口 这里本地调试的时候会出现 跨域问题，自行解决
        var host = window.location.hostname === 'localhost' ? 'testapi.wanwu.com' : 'api.wanwu.com';
        var service = {
            catchError: function(error_no) {
                var error_messge = {
                    '101': '参数错误',
                    '301': '后台请联系管理员',
                    '400': '您没有相关权限',
                    '401': window.location.href = '/newosadmin/user/login',
                    '402': '系统异常，请稍候再试',
                    '404': '系统不允许到操作',
                    '500': '服务器错误，请稍候再试',
                }[error_no] || '未知或者网络错误！';
                return error_messge;
            },
            //请求数据
            getData: function(url, data, callback) {
                $.ajax({
                    dataType: 'json',
                    method: 'POST',
                    url: url,
                    data: data
                }).done(function(result) {
                    //有返回数据
                    if (result.error_no === 0) {
                        //请求成功，有数据
                        callback(true, result.content);
                    } else {
                        //请求失败，无数据
                        callback(false, catchError(result.error_no));
                    }
                }).fail(function(result) {
                    //无返回数据
                    callback(false, catchError('code'));
                })
            },
            //请求结果处理
            /*dataHandle:function(url,data,callback){
                this.getData(url,data,function(isTrue,reData){
                    if (isTrue) {
                        //有数据
                        callback(reData);
                    }else{
                        alert(catchError(reData.errorCode));
                        callback(false);
                    }
                })
            }*/
            //用户登录  传入 手机号 登录类型，0 为密码 1 为验证码
            userLogin: function(phoneNum, type, password, from, callback) {
                var url = host + '/user/login';
                var data = {
                    mobile: phoneNum,
                    type: type,
                    password: password,
                    from: from || 'web'
                };
                getData(url, data, function(isTrue, reContent) {
                    if (isTrue) {
                        //获取登陆结果
                        if (reContent.length > 0) {
                            var userInfo = JSON.stringify(reContent.userInfo);
                            window.localStorage.setItem('userInfo', userInfo);
                            //将获取的用户信息存在本地存储中 获取方式为：var  useuInfo = JSON.parse(window.localStorage.getItem('userInfo')); 这样，获取的就是数据对象。
                            callback(true, reContent.rights);
                        } else {
                            callback(false, '登陆失败');
                        }
                    } else {
                        callback(false, reContent);
                    }
                });
            },
            //用户退出 暂无
            userLogout: function() {},
            //请求验证码 传入 手机号
            userSendCaptcha: function(phoneNum) {
                var url = host + '/user/sendCaptcha';
                var data = {
                    mobile: phoneNum
                };
                getData(url, data, function(isTrue, reContent) {
                    if (isTrue) {
                        callback(true, reContent);
                    } else {
                        callback(false, reContent);
                    }
                })
            },
            //修改密码  暂无
            userReset: function() {},
            //获取拜访纪录列表 传入 关键词 （可无，没有为空 “”）分页信息： 第一页 每页多少条数据 
            // 返回数据为数组，如果是空关键字，则返回 今天和之前的列表，如果是包含关键字 则返回 搜索结果
            serviceMyRecord: function(keyValue, page, pageSize, callback) {
                var url = host + '/service/myRecord';
                var userInfo = getUserInfo();
                if (userInfo) {
                    var data = {
                        userId: userInfo.id,
                        token: userInfo.token,
                        PageNumber: page || 0,
                        pageSize: pageSize || 10,
                        keyword: keyValue || ""
                    };
                    getData(url, data, function(isTrue, reContent) {
                        if (isTrue) {
                            if (keyValue.length > 0) {
                                callback(true, reContent.searchLists);
                            } else {
                                callback(true, [reContent.todayLists, reContent.beforeLists]);
                            }
                        } else {
                            callback(false, reContent);
                        }
                    })
                }
            },
            //获取拜访纪录详情
            serviceMyRecordDetail: function(id, callback) {
                //获取用户信息
                var url = host + '/service/myRecordDetail';
                var userInfo = getUserInfo();
                if (userInfo) {
                    var data = {
                        userId: userInfo.id,
                        token: userInfo.token,
                        taskId: id
                    };
                    getData(url, data, function(isTrue, reContent) {
                        callback(isTrue, reContent);
                    });
                };
            },

            /**
            名称  类型  是否必须    默认值 描述
            userId  String  是       用户名
            token   String  是       token
            taskId  int 否       任务id,如果存在我将执行更新操作，没有我执行插入操作
            mobile  String  是       手机号
            shopName    String  是       超市名称
            shopLogo    String  否       图片url
            pid String  是       省份id
            cid String  否       城市id
            did String  否       区域id
            parentId    String  否       父级id
            location    String  是       地址位置
            address String  否       详细地址
            scales  String  否       超市规模
            running_state   String  否       经营状况
            remark  String  否       备注
            */
            //保存我的拜访纪录
            serviceSaveMyRecord: function(taskId, shopName, shopLogo, provinces, city, district, parentId, location, address, scales, running_state, remark, callback) {
                var url = host + '/service/saveMyRecord';
                var userInfo = getUserInfo();
                if (userInfo) {
                    var data = {
                        userId: userInfo.id,
                        token: userInfo.token,
                        taskId: "" || 0,
                        mobile: userInfo.phone,
                        shopName: shopName,
                        shopLogo: shopName,
                        pid: provinces,
                        cid: city,
                        did: district,
                        parentId: parentId,
                        location: location,
                        address: address,
                        scales: scales,
                        running_state: running_state,
                        remark: remark
                    };
                    getData(url, data, function(isTrue, reContent) {
                        callback(isTrue, reContent);
                    });
                }
            },
            //获取地址列表
            serviceGetAddress: function(region, callback) {
                var url = host + '/service/getAddress';
                var data = {
                    regionId: region || 1
                }
                getData(url, data, function(isTrue, reContent) {
                    callback(isTrue, reContent);
                })
            },
            //获取用户信息
            getUserInfo: function() {
                var localItem = window.localStorage.getItem('userInfo');
                if (localItem) {
                    return JSON.parse(localItem);
                } else {
                    //
                    catchError('error_login');
                    return false;
                }
            },
            // 获取我的用户列表 提供关键字 如果没有关键字则返回 当前默认列表  分页信息 page pageSize
            serviceSaveMyCustomers: function(keyValue, page, pageSize,callback) {
                var url = host + '/service/myCustomers';
                var userInfo = getUserInfo();
                if (userInfo) {
                    var data = {
                        userId: userInfo.id,
                        token: userInfo.token,
                        keywords: keyValue || "",
                        PageNumber: page || 0,
                        PageSize: pageSize
                    };
                    getData(url, data, function(isTrue, reContent) {
                        //
                        /*if (isTrue) {
                            if (keyValue.length > 0) {
                                callback(true,[reContent.todayLists,reContent.beforeLists]);
                            }else{
                                callback(true,reContent.searchLists);
                            }
                        }else{
                            callback(false,reContent);
                        }*/
                        callback(isTrue,reContent);
                    });
                };
            },
            //保存我的用户详情
            serviceSaveMyCustomersDetail: function(id,callback) {
                var url = host + '/service/myCustomersDetail';
                var userInfo = getUserInfo();
                if (userInfo) {
                    var data = {
                        userId : userInfo.id,
                        token : userInfo.token,
                        taskId : id
                    };
                    getData(url, data, function(isTrue, reContent) {
                        //
                        callback(isTrue,reContent)
                    })
                };
            },
            //获取所有员工
            manageGetEmployeeList: function(keyValue,callback) {
                var url = host + '/service/getEmployeeList';
                var userInfo = getUserInfo();
                if (userInfo) {
                    var data = {
                        userId:userInfo.id,
                        token::userInfo.token,
                        keyword:keyValue || ""
                    };
                    getData(url, data, function(isTrue, reContent) {
                        //
                        callback(isTrue,reContent);
                    })
                };
            },
            //获取部门列表 关键字 第几页 每页多少个
            departmentList: function(keyValue，page,pageSize,callback) {
                var url = host + '/service/departmentList';
                var data = {
                    page:page,
                    pageSize:pageSize,
                    search:keyValue || ""
                };
                getData(url, data, function(isTrue, reContent) {
                    // reContent.departmentList 为部门信息
                    callback(isTrue,reContent);
                });
            },
            //获取部门详情
            departmentDetail: function(id,callback) {
                var url = host + '/service/departmentDetail';
                var data = {
                    dpId:id
                };
                getData(url, data, function(isTrue, reContent) {
                    //
                    callback(isTrue,reContent);
                })
            },
            //删除部门
            departmentDelete: function(id,callback) {
                var url = host + '/service/delDepartment';
                var data = {
                    dpId:id
                };
                getData(url, data, function(isTrue, reContent) {
                    //
                    if (isTrue) {
                        callback(true,"成功")
                    }else{
                        callback(isTrue,reContent)
                    }
                });
            },
            //获取部门员工
            departmentEmployeeList: function(id,head,page,pageSize,callback) {
                var url = host + '/service/employeeList';
                var data = {
                    dpId:id,
                    chargeId:head,
                    page:page || 1,
                    pageSize:pageSize || 10
                };
                getData(url, data, function(isTrue, reContent) {
                    //
                    callback(isTrue,reContent);
                })
            },
            //添加/编辑部门
            departmentUpdate: function(id,name,images,notice,head,upNotice,callback) {
                var url = host + '/service/updateDepartment';
                var userInfo = getUserInfo();
                var data = {
                    dpId:id,
                    departmentName:name,
                    headImage:images,
                    departmentNotice:notice,
                    chargeId:head,
                    isEditSubDepartmentNotice:upNotice
                };
                getData(url, data, function(isTrue, reContent) {
                    //
                    if (isTrue) {
                        callback(true,"成功")
                    }else{
                        callback(isTrue,reContent)
                    }

                })
            }
        };
        return service;
    });
});