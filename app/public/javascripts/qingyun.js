/**
 * Created by wuyang on 2016/12/1.
 */
$(function(){
//获取青云日期
  var date = $("#date").val();
  $.ajax({
    url:'/qingyun/api/',
    type:'get',
    success:function(data){
      var instanceStr = '';
      var volumeStr = '';
      var bandwidthStr = '';
      if(data.code == 0){
        data.list.forEach((item) => {
          instanceStr += '<a href="/qingyun/instance/'+item.date+'" class="btn btn-default btn-lg">'+item.date+'</a>';
          volumeStr += '<a href="/qingyun/volume/'+item.date+'" class="btn btn-default btn-lg">'+item.date+'</a>';
          bandwidthStr += '<a href="/qingyun/bandwidth/'+item.date+'" class="btn btn-default btn-lg">'+item.date+'</a>';
        });
        $('#instance_links').html(instanceStr);
        $('#volume_links').html(volumeStr);
        $('#bandwidth_links').html(bandwidthStr);
      }else{

      }
    },
    error:function(err){
      console.log(err)
    }
  });
  //获取青云主机价格列表
  $.ajax({
    url:'/qingyun/api/instance/',
    type:'get',
    data:{
      date:date
    },
    success:function(data){
      var trStr = '';
      if(data.code == 0){
        data.list.forEach((item) => {
          var {images, resourceClass, cpu, memory, price, date, make, change} = item;
          trStr += `
            <tr>
            <td>${images}</td>
            <td>${resourceClass}</td>
            <td>${cpu}</td>
            <td>${memory}</td>
            <td>${make}</td>
            <td>${price}</td>
            <td>${change}</td>
            <td>${date}</td>
            </tr>
          `
        });
        $('#box_instance').html('<table class="table table-condensed table-hover" id="instanceTable"><thead><tr><th>镜像</th><th>类型</th><th>cpu</th><th>内存</th><th>标识</th><th>价格</th><th>价格变化</th><th>日期</th></tr></thead>'+ trStr+ '</table>');
      }else{

      }
    },
    error:function(err){
      console.log(err)
    }
  });

  //获取青云硬盘价格列表
  $.ajax({
    url:'/qingyun/api/volume/',
    type:'get',
    data:{
      date:date
    },
    success:function(data){
      var trStr = '';
      if(data.code == 0){
        data.list.forEach((item) => {
          var {type, size, price, date} = item;
          trStr += `
            <tr>
            <td>${type}</td>
            <td>${size}</td>
            <td>${price}</td>
            <td>${date}</td>
            </tr>
          `
        });
        $('#box_volume').html('<table class="table table-striped table-hover" id="instanceTable"><thead><tr><th>种类</th><th>大小</th><th>价格</th><th>日期</th></tr></thead>'+ trStr+ '</table>');
      }else{

      }
    },
    error:function(err){
      console.log(err)
    }
  });

  //获取青云带宽价格列表
  $.ajax({
    url:'/qingyun/api/bandwidth/',
    type:'get',
    data:{
      date:date
    },
    success:function(data){
      var trStr = '';
      if(data.code == 0){
        data.list.forEach((item) => {
          var {size, price, date} = item;
          trStr += `
            <tr>
            <td>${size}</td>
            <td>${price}</td>
            <td>${date}</td>
            </tr>
          `
        });
        $('#box_bandwidth').html('<table class="table table-striped table-hover" id="instanceTable"><thead><tr><th>大小</th><th>价格</th><th>日期</th></tr></thead>'+ trStr+ '</table>');
      }else{

      }
    },
    error:function(err){
      console.log(err)
    }
  });

})