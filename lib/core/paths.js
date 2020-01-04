import path from 'path'

const PATH_ROOT = path.join(__dirname, '..', '..')
const paths = {
  PATH_ROOT,
  PATH_LIB: path.join(PATH_ROOT, 'lib'),
  PATH_LOG: path.join(PATH_ROOT, 'log'),
  PATH_DATA: path.join(PATH_ROOT, 'data')
}

export default paths
