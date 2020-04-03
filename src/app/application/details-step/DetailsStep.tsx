import React from 'react';
import { StepConfigProps, StepID } from '../stepConfig';
import ApplicationStep from '../ApplicationStep';

const DetailsStep = ({ onValidSubmit }: StepConfigProps) => {
    return (
        <ApplicationStep id={StepID.WELCOME} onValidFormSubmit={onValidSubmit}>
            Detaljer
        </ApplicationStep>
    );
};

export default DetailsStep;
