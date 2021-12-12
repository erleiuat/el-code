const icon = ''

const t1 = ''
const t2 = ''
const t3 = ''
const t4 = ''
const t5 = ''

let lang = 'sss'

const cmmd = {
  singleIn: '//',
  singleOut: '',
  in: '/*',
  out: '*/',
}

if (lang === 'python') {
  cmmd.singleIn = '#'
  cmmd.in = '"""'
  cmmd.out = '"""'
} else if (lang === 'twig') {
  cmmd.singleIn = '{#'
  cmmd.singleOut = '#}'
  cmmd.in = '{#'
  cmmd.out = '#}'
}