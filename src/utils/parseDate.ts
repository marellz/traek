import moment from 'moment'

export const parseDate = (dateString: string, format: string = 'Do MMM YYYY') => {
  return moment(dateString).format(format)
}
