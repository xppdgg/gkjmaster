<template>
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol"
      style="width: 600px;">
      <a-form-item label="机器" name="uuid">
        <a-select v-model:value="formState.uuid" placeholder="please select your zone" style="width: 200px;">
          <a-select-option v-for="(item,index) in uuids" :value="item.uuid">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item ref="orderid" label="订单号" name="orderid">
        <a-input v-model:value="formState.orderid" style="width: 200px;" />
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
      <a-form-item label="开始时间" required name="utc_create">
          <DatePicker></DatePicker>
      </a-form-item>
      <a-form-item label="结束时间" required name="tm0">
            <DatePicker></DatePicker>
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
  import { doSql } from '../../api/axios/axios';
  import { Item } from 'ant-design-vue/es/menu';
  import { DatePicker, InputNumber } from 'ant-design-vue';
  const {uuids} = defineProps({
      uuids:ref<any>([])
  })
  interface FormState {
    uuid: string;
    orderid:string;
    proname: string;
    code: '';
    int_g0:number;
    int_g1:number;
    int_g2:number;
    region: string | undefined;
    date1: Moment | undefined;
    delivery: boolean;
    type: string[];
    resource: string;
    desc: string;
  }
  
  const formRef = ref();
  const formState: UnwrapRef<FormState> = reactive({
    uuid: '',
    orderid:'',
    proname: '',
    code: '',
    int_g0:0,
    int_g1:0,
    int_g2:0,
    region: undefined,
    date1: undefined,
    delivery: false,
    type: [],
    resource: '',
    desc: '',
  });
  const rules = {
    name: [
      { required: true, message: 'Please input Activity name', trigger: 'blur' },
      { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
    date1: [{ required: true, message: 'Please pick a date', trigger: 'change', type: 'object' }],
    type: [
      {
        type: 'array',
        required: true,
        message: 'Please select at least one activity type',
        trigger: 'change',
      },
    ],
    resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
    desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
  };
  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
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
  
  