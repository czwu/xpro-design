<template>
    <div class="material-layout flex-col">
        <span class="material-head">
            <svg-icon icon-class="material" class="head-icon" />
        </span>
        <ul class="material-list">
            <li v-for="(group, i) in materials" :key="i" class="material-group">
                <a>
                    <svg-icon :icon-class="group.icon" />
                </a>
                <ul ref="dragList" class="group-content" :class="group.class">
                    <li
                        v-for="(item, i) in group.children"
                        :key="i"
                        :name="item.name"
                        :code="item.code"
                        :label="item.label"
                        class="material-item"
                    >
                        <a>
                            <svg-icon :icon-class="item.icon || item.name" />
                            <span class="material-name">{{ item.label }}</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>

import { defineComponent, ref, reactive } from 'vue'
import Sortable from 'sortablejs'
import { materials } from '@/config/materials'
export default defineComponent({
    setup() {
        const mates = ref(0)

        return {
            materials
        }
    }
})
</script>


<style lang="scss" scope>
.material-layout {
    min-width: 68px;
    max-width: 68px;
    transition: margin-left 0.35s ease-in-out, left 0.35s ease-in-out,
        margin-right 0.35s ease-in-out, right 0.35s ease-in-out;
    direction: ltr;
    background: #293042;
    .material-head {
        padding: 1.15rem 1.4rem;
        display: block;
        text-align: center;
        color: #fff;
        .svg-icon {
            fill: #4a88eb !important;
            height: 24px;
            width: 24px;
            margin-right: 0.15rem;
        }
    }

    .svg-icon {
        width: 18px;
        height: 18px;
    }
    .material-list > .material-group {
        position: relative;
        > a {
            display: block;
            padding: 0.6rem 1.5rem;
            font-weight: 400;
            position: relative;
            text-decoration: none;
            cursor: pointer;
            color: #ccc;
        }
        .group-content {
            display: none;
            overflow: visible;
            position: absolute;
            left: 80px;
            z-index: 1000;
            width: 150px;
            box-shadow: 0 0.5rem 3rem 0.5rem rgb(0 0 0 / 8%);
            border-radius: 0.3rem;
            background: #293042e0;
            padding: 0.5rem 0;
            font-size: 13px;
            top: 0;
            .material-item > a {
                display: block;
                padding: 0.6rem 1.5rem;
                color: #b3b3b3;
                padding: 0.45rem 1.5rem;
                cursor: move;
            }
            &.half {
                width: 300px;
                .material-item {
                    width: 48%;
                    float: left;
                }
            }
        }
        &:hover {
            background: #9a969e1a;
            > a {
                color: rgba(233, 236, 239, 0.8);
            }
            .group-content {
                cursor: move;
                &::before {
                    left: -40px;
                    content: "";
                    position: absolute;
                    top: 0px;
                    width: 40px;
                    height: 100%;
                }
                display: block;
                .svg-icon {
                    line-height: 20px;
                    vertical-align: middle;
                }
                .material-name {
                    line-height: 20px;
                    padding: 2px 0 0 10px;
                }
                .material-group,
                a {
                    &:hover {
                        color: #fff;
                    }
                }
            }
        }
    }
}
.dragging .group-content {
    visibility: hidden;
}
</style>
