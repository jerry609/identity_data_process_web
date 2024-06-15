<template>
    <a-layout>
        <a-layout-header>
            <div class="logo" />
            <a-menu theme="dark" mode="horizontal" default-selected-keys="['1']" style="line-height: 64px">
                <!-- <a-menu-item key="1">首页</a-menu-item> -->
                <a-menu-item key="2">操作日志</a-menu-item>
                <!-- <a-menu-item key="3">登录日志</a-menu-item> -->
                <!-- <a-menu-item key="4">用户管理</a-menu-item> -->
            </a-menu>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
            <a-breadcrumb style="margin: 16px 0">
                <a-breadcrumb-item>首页</a-breadcrumb-item>
                <a-breadcrumb-item>操作日志</a-breadcrumb-item>
            </a-breadcrumb>
            <div class="site-layout-content">
                <a-tabs default-active-key="1">
                    <a-tab-pane key="1" tab="活动模块">
                        <ActivityModule />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="部门模块">
                        <DepartmentModule />
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="心理测评模块">
                        <PsychometricModule />
                    </a-tab-pane>
                </a-tabs>
            </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">

        </a-layout-footer>
    </a-layout>
</template>

<script>
import ActivityModule from "@/components/LogModule/ActivityModule";
import DepartmentModule from "@/components/LogModule/DepartmentModule";
import PsychometricModule from "@/components/LogModule/PsychometricModule";

export default {
    name: "MainLayout",
    components: {
        ActivityModule,
        DepartmentModule,
        PsychometricModule,
    },
};
</script>

<style>
.site-layout-content {
    background: #fff;
    padding: 24px;
    min-height: 280px;
}
</style>