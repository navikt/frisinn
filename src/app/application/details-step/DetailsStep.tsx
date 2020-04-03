import React from 'react';
import { StepConfigProps, StepID } from '../stepConfig';
import ApplicationStep from '../ApplicationStep';

const DetailsStep = ({ onValidSubmit }: StepConfigProps) => {
    return (
        <ApplicationStep id={StepID.DETAILS} onValidFormSubmit={onValidSubmit}>
            Detaljer
        </ApplicationStep>
    );
};

export default DetailsStep;
