import React from 'react';
import ApplicationStep from '../ApplicationStep';
import { StepConfigProps, StepID } from '../stepConfig';

const FrilanserStep = ({ onValidSubmit }: StepConfigProps) => {
    return (
        <ApplicationStep id={StepID.FRILANSER} onValidFormSubmit={onValidSubmit}>
            Frilanser
        </ApplicationStep>
    );
};

export default FrilanserStep;
