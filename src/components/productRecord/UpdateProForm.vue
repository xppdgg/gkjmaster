<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
    style="width: 600px;">
    <a-form-item label="机器" name="uuid">
      <a-select v-model:value="formState.uuid" placeholder="please select your zone" style="width: 200px;">
        <a-select-option v-for="(item, index) in uuids" :value="item.uuid">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item ref="str2" label="订单号" name="str2">
      <a-input v-model:value="formState.str2" style="width: 200px;" />
    </a-form-item>
    <a-form-item ref="name" label="产品名称" name="name">
      <a-input v-model:value="formState.name" style="width: 200px;" />
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
    <a-form-item label="开始时间" name="utc_create">
      <DatePicker v-model:value="(utc_create1 as any)" :show-time="{format:'HH:mm:ss'}" @ok="()=>{formState.utc_create=utc_create1.format('YYYY-MM-DD HH:mm:ss')}"></DatePicker>
    </a-form-item>
    <a-form-item label="结束时间"  name="tm0">
      <DatePicker v-model:value="(tm01 as any)" show-time @ok="()=>{formState.tm0=tm01.format('YYYY-MM-DD HH:mm:ss')}"></DatePicker>
    </a-form-item>
  </a-form>
  <div style="display: flex;justify-content: space-around;">
    <a-button type="primary" @click="onSubmit">确定</a-button>
    <!-- <a-button style="margin-left: 10px" @click="resetForm">重置</a-button> -->
  </div>
</template>
<script lang="ts" setup>
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

import { onBeforeMount, reactive, Ref, ref, toRaw, UnwrapRef, watch } from 'vue';
import { doSql,updateProductSql } from '../../api/axios/axios';
import { Item } from 'ant-design-vue/es/menu';
import { DatePicker, InputNumber, message } from 'ant-design-vue';
import moment from 'moment';
const emits = defineEmits(['getData'])
const getData1 = ()=>{
    emits('getData',0,10)
}
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };

const { uuids, selectRow } = defineProps({
  uuids: ref<any>([]),
  selectRow: ref<any>({})
})
interface FormState {
  id:number,
  uuid: string;
  str2: string; //订单号
  name: string;
  code: '';
  int_g0: number;
  int_g1: number;
  int_g2: number;
  utc_create: string,
  tm0: string,
  // utc_create1:Ref<moment.Moment>
}

const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
  id:0,
  uuid: '',
  str2: '',
  name: '',
  code: '',
  int_g0: 0,
  int_g1: 0,
  int_g2: 0,
  utc_create: '',
  tm0: '',
  version:0
});
const utc_create1= ref<moment.Moment>(moment(formState.utc_create!=''?formState.utc_create:'2024','YYYY-MM-DD HH:mm:ss'))
const tm01 = ref<moment.Moment>(moment('2024','YYYY-MM-DD HH:mm:ss'))
// watch(
//   formState,  
//     ()=>{
//       utc_create1.value = moment(formState.utc_create,'YYYY-MM-DD HH:mm:ss')
// })
const rules = {};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(async() => {
      console.log('values', formState, toRaw(formState));
      let rs = await updateProductSql(toRaw(formState))
      console.log(rs);
      if(rs.message=='success'){
        message.success('修改成功')
        getData1()
      }
      else{
        message.error('修改失败')
      }
      
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log('error', error);
    });
};
const resetForm = () => {
  // console.log(utc_create1.value.format('YYYY-MM-DD HH:mm:ss'),formState.utc_create);
  formRef.value.resetFields();
};

watch(selectRow,() => {
  console.log(333, selectRow);
  formState.id = selectRow.id
  formState.code = selectRow.code
  formState.int_g0 = selectRow.int_g0
  formState.int_g1 = selectRow.int_g1
  formState.int_g2 = selectRow.int_g2
  formState.str2 = selectRow.str2
  formState.name = selectRow.name
  formState.tm0 = selectRow.tm0
  formState.utc_create = selectRow.utc_create
  formState.uuid = selectRow.uuid
},{deep:true,immediate:true})

// onBeforeMount(()=>{
//   console.log(333, selectRow);
//   formState.id = selectRow.id
//   formState.code = selectRow.code
//   formState.int_g0 = selectRow.int_g0
//   formState.int_g1 = selectRow.int_g1
//   formState.int_g2 = selectRow.int_g2
//   formState.str2 = selectRow.str2
//   formState.name = selectRow.name
//   formState.tm0 = selectRow.tm0
//   formState.utc_create = selectRow.utc_create
//   formState.uuid = selectRow.uuid
// })



</script>
  
  