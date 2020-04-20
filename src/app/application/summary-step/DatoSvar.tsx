import React from 'react';
import { ApiStringDate } from 'common/types/ApiStringDate';
import { apiStringDateToDate, prettifyDateExtended } from 'common/utils/dateUtils';

interface Props {
    apiDato: ApiStringDate;
}
export const prettifyApiDate = (apiDato: ApiStringDate): string => prettifyDateExtended(apiStringDateToDate(apiDato));

const DatoSvar: React.FunctionComponent<Props> = ({ apiDato }: Props) => <>{prettifyApiDate(apiDato)}</>;

export default DatoSvar;
