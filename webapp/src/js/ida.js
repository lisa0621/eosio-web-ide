var ida = (function(){
        csmapi.set_endpoint ('https://5.iottalk.tw');
        var profile = {
		    'dm_name': 'Block_DM',          
			'idf_list':[Block_IDF],
			'odf_list':[Block_ODF],
            'd_name': undefined,
        };

        var testVal = 0;
        var dataList = new Array();

        function setTestVal(num){
            testVal = num;
        }
		
        function Block_IDF(){
            //return Math.random();
           //return test.prototype.cube(3);
           //console.log("testVal:"+testVal);
           return testVal;
        }

        function Block_ODF(data){
           dataList = data;
           $('.ODF_value')[0].innerText=data[0];          
        }

        function getDataList(){
            return dataList;
        }
      
/*******************************************************************/                
        function ida_init(){
	        console.log(profile.d_name);
        }

        var ida = {            
            'ida_init': ida_init,
            'setTestVal': setTestVal,
            'getDataList': getDataList
        };
    
        dai(profile, ida);  
        return ida;          
})();
