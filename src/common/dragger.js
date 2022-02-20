import Sortable from "sortablejs";
import { emitter, EVENTS } from './bus'
import { getComponentId } from '../utils/util'
import context from '../common/context'
import Metadata from '../common/metadata'
let currPosStr = ''
export default {
    /**
     * 可拖拽物料面板初始化
     * @param {*} meterials 
     */
    initMaterialDrag(meterialGroups) {
        meterialGroups.forEach((groupElement) => {
            var ops = {
                animation: 400,
                ghostClass: "sortable-ghost",
                sort: false,
                group: {
                    name: "material", // 组名
                    pull: 'clone',
                    put: false,
                },
                onStart(evt) {
                    emitter.emit(EVENTS.MATERIAL_DRAG_START, evt);
                },
                onEnd(evt) {
                    evt.item.parentElement.removeChild(evt.item)
                    emitter.emit(EVENTS.MATERIAL_DRAG_STOP, evt);
                },
                onClone(evt) {
         
                },
                onMove: function (/** Event*/ evt, /** Event*/ originalEvent) {
                    const pos = `${originalEvent.clientX}-${originalEvent.clientY}`;
                    if (!originalEvent.clientX) {
                        return false;
                    }
                    if (currPosStr === pos) {
                        return false;
                    } else {
                        currPosStr = pos;
                    }
                },
            };
            // 初始化
            Sortable.create(groupElement, ops);
        });
    },


    initDrag(el, props) {
        var ops = {
            animation: 300,
            dragClass: 'sortable-drag',
            chosenClass: 'sortable-chosen',
            ghostClass: 'sortable-ghost',
            dataIdAttr: 'uuid',
            filter: '.layout-tools',
            fallbackOnBody: false,
            removeCloneOnHide: false,
            emptyInsertThreshold: 2,
            fallbackTolerance: 100,
            sort: true,
            group: {
                name: 'design', // 组名为itxst
                pull: true, // 是否允许拖入当前组
                put(item1, item2, el) {
                    const name = el.getAttribute('name')
                    const uid = el.getAttribute('uid')
                    let component = null
                    if (name) {
                        component = context.components[name]
                    } else if (uid) {
                        const meta = Metadata.getComponentById(uid)
                        component = context.components[meta.name]
                    }
                    if (!component) {
                        return true
                    }
                    if (component.checkPut) {
                        const parents = Metadata.getCompPathById(item1.el.getAttribute('uid'))
                        return component.checkPut(...parents)
                    }
                    return true
                }
            },
            onStart(evt) {
                emitter.emit(EVENTS.COMPONENT_DRAG_START, evt)
            },
            onAdd: function (evt) {
                const name = evt.item.getAttribute('name')
                const uid = evt.item.getAttribute('uid')
                if (uid) {
                    const meta = Metadata.getComponentById(uid)
                    const oldParentId = getComponentId(evt.from)
                    const oldParent = Metadata.getComponentById(oldParentId)
                    oldParent.children.splice(evt.oldIndex, 1)

                    const toUuid = getComponentId(evt.to)
                    const parent = Metadata.getComponentById(toUuid)
                    // 根据不通的布局 模式,需要做处理
                    if (parent.design && parent.design.mode === 'span') {
                        // 标准栅格模式, 元数需要包装col
                        parent.children.splice(getRealIndex(evt.to, evt.newIndex), 0, meta.name === 'col' ? meta : wrapCol(meta))
                    } else {
                        // flex 栅格模式,无需包装col,如有col,则去掉col
                        parent.children.splice(getRealIndex(evt.to, evt.newIndex), 0, meta.name === 'col' ? meta.children : meta)
                    }
                } else if (name) {
                    const toid = getComponentId(evt.to)
                    const parent = Metadata.getComponentById(toid)
                    let meta
                    if (parent.name === 'upload-img') {
                        return
                    }
                    if (['pie', 'line', 'bar', 'complex'].includes(name)) {
                        meta = context.getConfig('chart', { type: name })
                    } else {
                        meta = context.getConfig(name, parent)
                    }
                    // 对于动态业务组件,需要获取额外参数,并添加到元数据中
                    if (name === 'async-component') {
                        meta.label = evt.item.getAttribute('label')
                        meta.code = evt.item.getAttribute('code')
                    }
                    if (parent.design && parent.design.mode === 'span') {
                        // 包装col
                        parent.children.splice(getRealIndex(evt.to, evt.newIndex), 0, wrapCol(meta))
                    } else {
                        // 直接插入
                        parent.children.splice(getRealIndex(evt.to, evt.newIndex), 0, meta)
                    }

                    setTimeout(() => {
                        Metadata.selectComponent(meta.uid)
                    }, 0)
                }
                emitter.emit(EVENTS.METADATA_STEP_UPDATE)
            },
            onMove: function (/** Event*/evt, /** Event*/originalEvent) {
                const pos = `${originalEvent.clientX}-${originalEvent.clientY}`
                if (!originalEvent.clientX) {
                    return false
                }
                if (currPosStr === pos) {
                    return false
                } else {
                    currPosStr = pos
                }
            },
            onEnd: function (evt) {
                const oldIndex = evt.oldIndex
                const newIndex = getRealIndex(evt.to, evt.newIndex)
                // 同组内位置变更走该逻辑,通过vue set 切换子元素位置
                if (oldIndex !== newIndex && evt.from === evt.to) {
                    const parentId = getComponentId(evt.from)
                    const uid = getComponentId(evt.item)
                    const parent = Metadata.getComponentById(parentId)
                    const meta = Metadata.getComponentById(uid)
                    parent.children.splice(oldIndex, 1)
                    parent.children.splice(newIndex, 0, meta)
                    emitter.emit(EVENTS.METADATA_STEP_UPDATE)
                }
                // 拖拽结束事件通知
                emitter.emit(EVENTS.COMPONENT_DRAG_END, evt, true)
            }
        }
        // 初始化
        new Sortable(el, ops)

    }


}

function getRealIndex(parent, index) {
    const list = parent.children
    let spaceLen = 0
    for (let i = 0; i < index; i++) {
        if (list[i].classList.contains('drag-space') || list[i].classList.contains('layout-tools')) {
            spaceLen++
        }
    }
    return index - spaceLen
}

function wrapCol(meta) {
    let warpSpan = 6
    if (meta.design && meta.design.span) {
        warpSpan = meta.design.span
        meta.design._span = warpSpan
        meta.design.span = warpSpan ? 24 : 0
    }
    return {
        uuid: context.uuid('col'),
        name: 'col',
        props: {
            span: warpSpan
        },
        design: {},
        children: meta
    }
}