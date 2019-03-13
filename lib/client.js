import benchmark from 'benchmark'
import lodash from 'lodash'
import ReactDOM from 'react-dom'
import testComponent from 'react-benchmark-test-component' // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies

// Hack to make benchmark work via webpack
const Benchmark = benchmark.runInContext({_: lodash})
window.Benchmark = Benchmark

// Render an instance in the DOM before running the benchmark to make debugging easier
const container = document.createElement('div')
ReactDOM.render(testComponent(), container)
document.body.appendChild(container)

function createAndUpdateComponent(container, resolver, updates) {
  ReactDOM.render(testComponent(), container, () => {
    if (!updates) return resolver.resolve()

    createAndUpdateComponent(container, resolver, updates - 1)
  })
}

const bench = new Benchmark({
  defer: true,
  async: true,
  fn(deferred) {
    const container = document.createElement('div')
    createAndUpdateComponent(container, deferred, COMPONENT_UPDATES) // eslint-disable-line no-undef
  },
  onCycle(e) {
    window.benchmarkProgress(JSON.stringify(e.target))
  },
  onComplete() {
    window.benchmarkComplete(JSON.stringify(bench))
  }
})

bench.run()
