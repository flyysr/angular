import {isPresent, BaseException} from 'facade/lang';
import {ListWrapper, MapWrapper} from 'facade/collection';

import {ProtoView} from '../view';
import {ProtoRecordRange} from 'change_detection/change_detection';

import {CompileStep} from './compile_step';
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';

/**
 * Fills:
 * - (in parent): CompileElement#inheritedElementBinder.nestedProtoView
 * - CompileElement#inhertiedViewRoot
 *
 * Reads:
 * - (in parent): CompileElement#inhertiedViewRoot
 * - CompileElement#isViewRoot
 */
export class ProtoViewBuilder extends CompileStep {
  process(parent:CompileElement, current:CompileElement, control:CompileControl) {
    var inheritedProtoView = null;
    if (current.isViewRoot) {
      inheritedProtoView = new ProtoView(current.element, new ProtoRecordRange());
      if (isPresent(parent)) {
        if (isPresent(parent.inheritedElementBinder.nestedProtoView)) {
          throw new BaseException('Only one nested view per element is allowed');
        }
        parent.inheritedElementBinder.nestedProtoView = inheritedProtoView;
        if (isPresent(parent.variableBindings)) {
          MapWrapper.forEach(parent.variableBindings, (mappedName, varName) => {
            inheritedProtoView.bindVariable(varName, mappedName);
          });
        }
      }
    } else if (isPresent(parent)) {
      inheritedProtoView = parent.inheritedProtoView;
    }
    current.inheritedProtoView = inheritedProtoView;
  }
}
