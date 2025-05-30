<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
    style="width: 600px;">
    <a-form-item label="机器" name="uuid">
      <a-select v-model:value="formState.uuid" placeholder="please select your zone" style="width: 200px;">
        <a-select-option v-for="(item,index) in uuids" :value="item.uuid">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item ref="str2" label="订单号" name="str2">
      <a-input v-model:value="formState.str2" style="width: 200px;" />
    </a-form-item>
    <a-form-item ref="proname" label="产品名称" name="proname">
      <a-input v-model:value="formState.proname" style="width: 200px;" />
    </a-form-item>
    <a-form-item label="产品条码" name="code">
      <a-input v-model:value="formState.code" style="width: 200px;" />
    </a-form-item>
    <a-form-item label="合格数量" required name="int_g0">
        <InputNumber v-model:value="formState.int_g0"></InputNumber>
    </a-form-item>
    <a-form-item label="异常数量" required name="int_g1">
        <InputNumber v-model:value="formState.int_g1"></InputNumber>
    </a-form-item>
    <a-form-item label="校验合格数量" required name="int_g2">
        <InputNumber v-model:value="formState.int_g2"></InputNumber>
    </a-form-item>
  </a-form>
  <div style="display: flex;justify-content: space-around;">
    <a-button type="primary" @click="onSubmit">确定</a-button>
    <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
  </div>
</template>
<script lang="ts" setup>
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { Moment } from 'moment'
import { reactive, ref, toRaw, UnwrapRef } from 'vue';
import { doSql,addProductSql, whereSql } from '../../api/axios/axios';
import { Item } from 'ant-design-vue/es/menu';
import { InputNumber, message } from 'ant-design-vue';
import { userInfomation } from '../../store/userinfo';
const {uuids} = defineProps({
    uuids:ref<any>([]),
})
const emits = defineEmits(['getData'])
const getData1 = ()=>{
    emits('getData',0,10)
}
const userii = userInfomation()
interface FormState {
  uuid: string;
  str2:string;
  proname: string;
  code: '';
  int_g0:number;
  int_g1:number;
  int_g2:number;
}

const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
  uuid: '',
  str2:'',
  proname: '',
  code: '',
  int_g0:0,
  int_g1:0,
  int_g2:0,
});
const rules = {
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
};

interface product {
    uuid:string;
    name:string;
    code:string;
    int0:number;
    company_id:number,
    roleid: number,
    clwkgroup_id:number,
    clwkline_id:number,
    clwkdanyuan_id:number,	
    clwkstation_id:number,
    clwkmachine_id:number,
    logid:number,  //usreid
    str0:string, //username
    str2:string, // 订单号
    tm0?:string,
    int_g0:number, //合格数量
    int_g1:number,//异常数量
    int_g2:number//校对合格数量
}
const onSubmit = async() => {
  formRef.value
    .validate()
    .then(async() => {
      console.log('values', formState, toRaw(formState));
      let addProduct:product = {
          uuid:formState.uuid,
          name:formState.proname,
          code:formState.code,
          int0:userii?.userid,
          int_g0:formState.int_g0,
          int_g1:formState.int_g1,
          int_g2:formState.int_g2,
          company_id:userii.companyid,
          roleid:userii.roleid,
          logid:userii.userid,
          str0:userii.username,
          str2:formState.str2,
          clwkgroup_id:userii.clwkgroup_id as number,
          clwkline_id:userii.clwkline_id as number,
          clwkdanyuan_id:userii.clwkdanyuan_id as number,	
          clwkstation_id:userii.clwkstation_id as number,
          clwkmachine_id:userii.clwkmachine_id as number
      }
      let rs:any = await addProductSql(addProduct)
      console.log(99,rs);
      if(rs.message == 'success'){
        message.success('增加成功')
        getData1()
      }
      else{
        message.error("增加失败")
      }
      
      
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log('error', error);
    });
};
const resetForm = () => {
  formRef.value.resetFields();
};


const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
const other = '';

</script>

