import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import ErrorPage from '../../components/error-page/ErrorPage';
import Guide from '../../components/guide/Guide';
import VeilederSVG from '../../components/veileder-svg/VeilederSVG';

interface Props {
    title: string;
    children: React.ReactNode;
}

const NoAccessPage = ({ title, children }: Props) => {
    return (
        <ErrorPage pageTitle="Søknaden er ikke tilgjengelig">
            <Guide svg={<VeilederSVG mood="uncertain" />} kompakt={true} type="plakat">
                <Systemtittel>{title}</Systemtittel>
                <Box margin="m">{children}</Box>
            </Guide>
        </ErrorPage>
    );
};

export default NoAccessPage;
