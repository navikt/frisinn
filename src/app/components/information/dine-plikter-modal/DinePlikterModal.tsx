import React from 'react';
import Modal, { ModalProps } from 'common/components/modal/Modal';
import bemUtils from 'common/utils/bemUtils';
import DinePlikterContent from '../dine-plikter-content/DinePlikterContent';
import './dinePlikterModal.less';

const bem = bemUtils('dinePlikterModal');
const DinePlikterModal: React.FunctionComponent<ModalProps> = (props) => (
    <Modal className={bem.block} {...props}>
        <DinePlikterContent />
    </Modal>
);

export default DinePlikterModal;
