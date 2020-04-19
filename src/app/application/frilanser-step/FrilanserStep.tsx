import React from 'react';
import ApplicationStep from '../ApplicationStep';
import { StepConfigProps, StepID } from '../stepConfig';

const FrilanserStep = ({ resetApplication, onValidSubmit }: StepConfigProps) => {
    return (
        <ApplicationStep id={StepID.FRILANSER} onValidFormSubmit={onValidSubmit} resetApplication={resetApplication}>
            Frilanser
        </ApplicationStep>
    );
};

export default FrilanserStep;
