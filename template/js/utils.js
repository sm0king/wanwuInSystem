(function(win,$){
  //关于api接口 这里本地调试的时候会出现 跨域问题，自行解决
  var host = window.location.hostname === 'localhost' || window.location.hostname === '123.59.58.104' ? 'http://123.59.58.104/newosadmin' : 'http://www.wanwu.com/newosadmin';
  win.service = {
      catchError: function(error_no) {
          if (error_no == '401') {
            //未登录 分两种情况 一种 有本地 存储一种没有，当有本地存储的时候 自动登录
            if (window.localStorage.getItem('userInfo')) {
              //自动登录
              this.autoLogin();
              return;
            }else{
              window.location.href = '/diguaApp/index.html';
            }
          }
          var error_messge = {
              '101': '参数错误',
              '100': '暂无数据',
              '301': '后台错误请联系管理员',
              '400': '您没有相关权限',
              '402': '系统异常，请稍候再试',
              '404': '系统不允许的操作',
              '500': '服务器错误，请稍候再试',
          }[error_no] || '未知或者网络错误！';
          return error_messge;
      },

      //请求数据
      getData: function(url, data, callback) {
          var serviceThis = this;
          $.ajax({
              dataType: 'json',
              method: 'POST',
              url: url,
              data: data
          }).done(function(result) {
              //有返回数据
              if (result.error_no == 0) {
                  //请求成功，有数据
                  callback(true, result.content);
              } else {
                  //请求失败，无数据
                  callback(false, serviceThis.catchError(result.error_no));
              }
          }).fail(function(result) {
              //无返回数据
              callback(false, serviceThis.catchError('code'));
          })
      },
      //用户登录  传入 手机号 登录类型，0 为密码 1 为验证码
      userLogin: function(phoneNum, type, password, from, callback) {
          var url = host + '/user/login';
          var data = {
              mobile: phoneNum,
              type: type,
              password: password,
              from: from || 'web'
          };
          this.getData(url, data, function(isTrue, reContent) {
              if (isTrue) {
                  //获取登陆结果
                  if (reContent) {
                      var userInfo = JSON.stringify(reContent);
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

      /**
       * [获取拜访纪录列表]
       * @param  {[type]}   keyValue [关键词（可无，没有为空 “”）]
       * @param  {[type]}   page     [页码]
       * @param  {[type]}   pageSize [每页多少条数据]
       * @param  {Function} callback [返回数据为数组，如果是空关键字，则返回 今天和之前的列表，如果是包含关键字 则返回 搜索结果]
       * @return {[type]}            [description]
       */
      serviceMyRecord: function(data, callback) {
          var url = host + '/service/myRecord';
          var userInfo = this.getUserInfo();
          if (userInfo) {
                data.userId= userInfo.id,
                data.token= userInfo.token,
                this.getData(url, data, function(isTrue, reContent) {
                  if (isTrue) {
                      if (data.keywords) {
                          callback(true, reContent.searchLists);
                      } else {
                          callback(true, reContent.allLists);
                      }
                  } else {
                      callback(false, reContent);
                  }
                });
          }
      },
      // 获取拜访记录坐标列表
      serviceGetLocation: function(data,callback){
          var url = host + '/service/getLocation';
          var userInfo = this.getUserInfo();
          if (userInfo) {
                data.userId= userInfo.id,
                data.token= userInfo.token,
                this.getData(url, data, function(isTrue, reContent) {
                    callback(isTrue, reContent);
                });
          };
      },
      //获取拜访纪录详情
      serviceMyRecordDetail: function(id, callback) {
          //获取用户信息
          var url = host + '/service/myRecordDetail';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                  userId: userInfo.id,
                  token: userInfo.token,
                  taskId: id
              };
              this.getData(url, data, function(isTrue, reContent) {
                  callback(isTrue, reContent);
              });
          };
      },

      //保存我的拜访纪录
      /**
       * [function description]
       * @param  {[type]}   record  [传参]
       * @param  {Function} callback [description]
       * @return {[type]}            [description]
       */
      serviceSaveMyRecord: function(record , callback) {
          var url = host + '/service/saveMyRecord';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                  userId: userInfo.id,
                  token: userInfo.token,
                  taskId: record.taskId || "",
                  mobile: record.phone,
                  shopName: record.shopName,
                  shopLogo: record.shopLogo || "/diguaApp/images/tuwen.png",
                  consignee: record.consignee,
                  pid: record.pid,
                  cid: record.cid,
                  did: record.did,
                  parentId: record.parentId || 0,
                  location: record.local,
                  address: record.address,
                  scales: record.scales,
                  runningState: record.state,
                  remark: record.remark || ""
              };
              this.getData(url, data, function(isTrue, reContent) {
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
          this.getData(url, data, function(isTrue, reContent) {
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
              this.catchError('401');
              return false;
          }
      },
      /**
       * [获取我的用户列表]
       * @param  {[type]}   keyValue [提供关键字 如果没有关键字则返回 当前默认列表]
       * @param  {[type]}   page     [页码]
       * @param  {[type]}   pageSize [单页数量]
       * @param  {Function} callback [回调函数]
       * @return {[type]}            [description]
       */
      serviceGetMyCustomers: function(data,callback) {
            var url = host + '/service/myCustomers';
            var userInfo = this.getUserInfo();
            if (userInfo) {
                data.userId= userInfo.id,
                data.token= userInfo.token,
                this.getData(url, data, function(isTrue, reContent) {
                    callback(isTrue,reContent);
                });
            };
      },
      //获取我的用户详情
      serviceGetMyCustomersDetail: function(id,callback) {
          var url = host + '/service/myCustomersDetail';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                  userId : userInfo.id,
                  token : userInfo.token,
                  taskId : id
              };
              this.getData(url, data, function(isTrue, reContent) {
                  callback(isTrue,reContent)
              })
          };
      },
      // 保存我的用户详情`
      serviceSaveCustomersDetail: function(user, callback){
          var url = host + '/service/saveMyCustomers';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                  userId:userInfo.id,
                  token:userInfo.token,
                  taskId:user.taskId,
                  mobile:user.phone,
                  shopName:user.shopName,
                  shopLogo:user.shopLogo,
                  consignee:user.consignee,
                  pid:user.pid,
                  cid:user.cid,
                  did:user.did,
                  location:user.local,
                  address:user.address,
                  scales:user.scales,
                  runningState:user.state,
                  remark:user.remark,
              };
              this.getData(url, data, function(isTrue, reContent) {
                  callback(isTrue,reContent)
              })
          }
      },
      // 【废弃】获取业务数据
      getAchievement: function(keyValue,callback){
          var url = host + '/service/getAchievement';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                  userId:userInfo.id,
                  token:userInfo.token,
                  isDetail:keyValue || ""
              };
              this.getData(url, data, function(isTrue, reContent) {
                  callback(isTrue,reContent);
              })
          }
      },
      //   获取业务数据
      singleEmployeeDtCount: function(callback){
          var url = host + '/count/singleEmployeeDtCount';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                  userId:userInfo.id,
                  token:userInfo.token,
              };
              this.getData(url, data, function(isTrue, reContent) {
                  callback(isTrue,reContent);
              })
          }
      },
      //获取所有员工（老接口）
      manageGetEmployeeListOld: function(keyValue,isGroup,callback) {
          var url = host + '/manage/getEmployeeList';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                  userId:userInfo.id,
                  token:userInfo.token,
                  keywords:keyValue || "",
                  isGroup:isGroup || 0
              };
              this.getData(url, data, function(isTrue, reContent) {
                  callback(isTrue,reContent);
              })
          };
      },
      // 获取员工列表
      manageGetEmployeeList: function(data,callback) {
          var url = host + '/manage/employeeListNew';
          var userInfo = this.getUserInfo();
          if (userInfo) {
                data.userId    =    userInfo.id;
                data.token  =  userInfo.token;
                this.getData(url, data, function(isTrue, reContent) {
                    callback(isTrue,reContent);
                })
          };
      },
      // 获取员工详情
      getEmployeeDetail:function(id,callback){
          var url = host + '/manage/getEmployeeDetail';
          var userInfo = this.getUserInfo();
          if(userInfo){
                var data = {
                    userId: userInfo.id,
                    token: userInfo.token,
                    taskId: id
                };
                this.getData(url, data, function(isTrue, reContent) {
                    callback(isTrue, reContent);
                })
            }
        },
      // 保存员工
      saveEmployee: function(emp,callback){
          var url = host + '/manage/saveEmployee';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                userId:userInfo.id,
                token:userInfo.token,
                taskId:emp.taskId || "",
                dp_id:emp.dp_id || "",
                name:emp.name,
                parent_id:emp.parent_id || userInfo.id,
                phone:emp.phone,
                type:emp.type,
                img:emp.img || "/diguaApp/images/tuwen.png",
                pid:emp.pid,
                cid:emp.cid,
                did:emp.did,
                email:emp.email,
                pushFunction:emp.pushFun,
                shippingFunction:emp.shipFun,
                managementFunction:emp.manageFun,
                employeeCURD:emp.employeeCURD,
                firmFunction:emp.firmFun,
              };
              this.getData(url,data,function(isTrue, reContent){
                  callback(isTrue, reContent);
              });
          }
      },
      // 删除员工
      delEmployee: function(id,callback){
          var url = host + '/manage/delEmployee';
          var userInfo = this.getUserInfo();
          if (userInfo) {
              var data = {
                userId:userInfo.id,
                token:userInfo.token,
                taskId:id
              }
              this.getData(url,data,function(isTrue, reContent){
                  callback(isTrue, reContent);
              });
          }
      },
      // 获取职位
      getJobs: function(callback){
          var url = host + '/manage/getJobs';
          this.getData(url,"",function(isTrue, reContent){
              callback(isTrue, reContent);
          });
      },
      // 等待接货
      waitReceiving: function(){
          var url = host + '/service/waitReceiving';
          var userInfo = this.getUserInfo();
      },
      // 等待接货详情
      waitReceivingDetail: function(){
          var url = host + '/service/waitReceivingDetail';
          var userInfo = this.getUserInfo();
      },
      // 确定接货
      orderReceivingDo: function(){
          var url = host + '/service/orderReceivingDo';
          var userInfo = this.getUserInfo();
      },
      //获取部门列表 关键字 第几页 每页多少个
      departmentList: function(keyValue,page,pageSize,callback) {
          var url = host + '/department/departmentList';
          var data = {
              page:page,
              pageSize:pageSize,
              search:keyValue || ""
          };
          this.getData(url, data, function(isTrue, reContent) {
              // reContent.departmentList 为部门信息
              callback(isTrue,reContent);
          });
      },
      //获取部门详情
      departmentDetail: function(id,callback) {
          var url = host + '/department/departmentDetail';
          var data = {
              dpId:id
          };
          this.getData(url, data, function(isTrue, reContent) {
              //
              callback(isTrue,reContent);
          })
      },
      //删除部门
      departmentDelete: function(id,callback) {
          var url = host + '/department/delDepartment';
          var data = {
              dpId:id
          };
          this.getData(url, data, function(isTrue, reContent) {
              //
              if (isTrue) {
                  callback(true,"成功")
              }else{
                  callback(isTrue,reContent)
              }
          });
      },
      //获取部门员工
      departmentEmployeeList: function(id,leader,page,pageSize,callback) {
          var url = host + '/department/employeeList';
          var data = {
              dpId:id,
              chargeId:leader,
              page:page || 1,
              pageSize:pageSize || 10
          };
          this.getData(url, data, function(isTrue, reContent) {
              //
              callback(isTrue,reContent);
          })
      },
      //添加/编辑部门
      departmentUpdate: function(data,callback) {
          var url = host + '/department/updateDepartment';
          this.getData(url, data, function(isTrue, reContent) {
              if (isTrue) {
                  callback(true,"成功")
              }else{
                  callback(isTrue,reContent)
              }
          })
        },

        // 逆地理编码 定位当前位置
        getNowLocal: function(data,callback){
            var url = 'http://restapi.amap.com/v3/geocode/regeo?parameters'
            $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'jsonp',
                    data: {
                        key: "7da2c1565bd041d7236eb88feabec69f",
                        location:data,
                    }
                })
                .done(function(re) {
                    if (re.status) {
                        callback(true,re.regeocode)
                    }
                })
                .fail(function() {
                    console.log("error");
                })
        },
        // 地理编码 获取地理坐标
        getAddressLocal: function(data, callback) {
            $.ajax({
                    url: 'http://restapi.amap.com/v3/geocode/geo?parameters',
                    type: 'POST',
                    dataType: 'jsonp',
                    data: {
                        key: "7da2c1565bd041d7236eb88feabec69f",
                        address: data.addr,
                        city: data.city
                    }
                })
                .done(function(re) {
                    callback(re);
                })
                .fail(function() {
                    console.log("error");
                })
        },
        getBusinessUrl: function(url_name,isChild){
            // var record;
            // if (isChild) {
            //     record = './business/push/recordMyGuys.html';
            // }else {
            //     record = './business/push/recordList.html';
            // }
            var url = {
            //   '拜访记录':record,
            //   '我的用户':'./business/push/myUserList.html',
              '业务数据':'./business/push/myBusiness.html',
              '员工管理':'./business/manage/employeeList.html',
              '部门管理':'./business/manage/departmentList.html',
              '客户管理':'/newosadmin/customer/index',
              '客户信息':'/newosadmin/customer/getCustomerData',
              '我的业绩':'/newosadmin/count/myScore',
              // '配送业绩':'./business/manage/distributionList.html',
              // '厂商管理':'#',
            }[url_name] || 'javascript:;';
            return url;
        },
        getScale: function(key) {
            var list = {
                '0': '其他',
                '1': '小卖部',
                '2': '小型独立超市',
                '3': '中型独立超市',
                '4': '连锁超市',
                '5': '饭店'
            }[key];
            return list;
        },
        getState: function(key) {
            var list = {
                '0': '无法判断',
                '1': '好',
                '2': '中',
                '3': '差'
            }[key];
            return list;
        },
        getSearch: function(key) {
            var rep = new RegExp('\\b' + key + '=(.+?)(&|$)', 'ig'),
                result = rep.exec(window.location.search);
            return result ? decodeURI(result[1]) : null;
        },
        strCheck: function(str) {
            if (/['")><&?\/\.]/.test(str)) {
                return str.replace(/['"><&?\/\.]/ig, "");
            } else {
                return str;
            }
        },
        //获取厂商列表
        getVendorList: function(callback, vendor) {
            var url = host + '/vendor/vendorList';
            var data = vendor || {};
            this.getData(url, data, function(isTrue, reContent) {
                if (isTrue) {
                    callback(true, reContent.vendorList)
                } else {
                    callback(isTrue, reContent);
                }
            })
        },
        //获取厂商详情
        getVendorDetail: function(id, callback) {
            var url = host + '/vendor/vendorDetail';
            var data = {
                vendorId: id
            };
            this.getData(url, data, function(isTrue, reContent) {
                callback(isTrue, reContent);
            })
        },
        //删除厂商
        delVendor: function(id, callback) {
            var url = host + '/vendor/delVendor';
            var data = {
                vendorId: id
            };
            this.getData(url, data, function(isTrue, reContent) {
                if (isTrue) {
                    callback(true, "成功")
                } else {
                    callback(isTrue, reContent);
                }
            })
        },
        //添加/编辑厂商
        //mobile 为必填项
        //vendor 为需要修改的数据项 对象。 {} callback
        updateVendor: function(mobile, callback, vendor) {
            var url = host + '/vendor/updateVendor';
            var data = vendor || {};
            data.mobile = mobile;
            this.getData(url, data, function(isTrue, reContent) {
                if (isTrue) {
                    callback(true, "成功")
                } else {
                    callback(isTrue, reContent);
                }
            })
        },
        autoLogin:function(){
          var url = host + '/user/autoLogin';
          var userInfo = this.getUserInfo();
          data={
            userId:userInfo.id,
            token:userInfo.token
          }
          this.getData(url,data,function(isTrue,reContent){
            if (isTrue) {
                  //获取登陆结果
                  if (reContent) {
                      var userInfo = JSON.stringify(reContent);
                      window.localStorage.setItem('userInfo', userInfo);
                      //将获取的用户信息存在本地存储中 获取方式为：var  useuInfo = JSON.parse(window.localStorage.getItem('userInfo')); 这样，获取的就是数据对象。
                      window.location.reload()
                      return;
                  } else {
                      window.location.href = '/diguaApp/index.html';
                  }
              } else {
                  window.location.href = '/diguaApp/index.html';
              }
          });
        },
        // 获取用户权限表。新接口，不再是再登录的时候进行操作。
        getMyMessage: function(callback) {
            var url = host + '/my/getMyMessage';
            var data = {};
            this.getData(url, data, function(isTrue, reContent) {
                // var userRight = JSON.stringify(reContent.result);
                // window.localStorage.setItem('userRight', userRight);
                if (isTrue) {
                    var rightList = reContent.result;
                    service.getMyChildrenUser(function(flag, msg){
                        if (flag) {
                            callback(true,rightList,msg.isChild);
                        }
                    });
                }else{
                    callback(false,reContent);
                }
            });
        },
        // 是否存在下属员工接口
        getMyChildrenUser: function(callback){
            var url = host + '/service/getMyChildrenUser';
            var userInfo = this.getUserInfo();
            data={
              userId:userInfo.id,
              token:userInfo.token
            }
            this.getData(url, data, function(isTrue, reContent) {
                callback(isTrue, reContent);
            });
        },
        // 拜访记录下属部门
        getMyRecordList: function(callback){
            var url = host + '/service/getMyRecordList';
            var userInfo = this.getUserInfo();
            data={
              userId:userInfo.id,
              token:userInfo.token
            }
            this.getData(url, data, function(isTrue, reContent) {
                callback(isTrue, reContent);
            });
        },
        // 修改密码
        updatePwd: function(callback){
            var url = host + '/my/updatePwd';
            var userInfo = this.getUserInfo();
            data.userId = userInfo.id,
            data.token = userInfo.token
            this.getData(url, data, function(isTrue, reContent) {
                callback(isTrue, reContent);
            });
        },

        // 【客户管理】  获取部门
        getSubDepartmentList: function(data,callback){
            var url = host + '/department/getSubDepartmentList';
            var userInfo = this.getUserInfo();
            data.userId = userInfo.id,
            data.token = userInfo.token
            this.getData(url, data, function(isTrue, reContent) {
                callback(isTrue, reContent);
            });
        },

        // 【客户信息】 获取列表坐标值
        getCustomerLocation: function(data,callback){
            var url = host + '/customer/getCustomerLocation';
            var userInfo = this.getUserInfo();
            data.userId = userInfo.id,
            data.token = userInfo.token
            this.getData(url, data, function(isTrue, reContent) {
                callback(isTrue, reContent);
            });
        },

        // H5获取当前地理坐标
        getH5Local: function(callback){
            if(!navigator.geolocation){
                alert("不支持位置定位");
            }else {
               navigator.geolocation.getCurrentPosition(function(poi){
                   callback(poi.coords);
               });
            }
        }

    };
})(window, jQuery);
