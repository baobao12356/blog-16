import dva from 'dva'
import createHistory from 'history/createBrowserHistory';
import './index.css'

// const modelList = [
//     // MainWrapperModel,
//     // LayoutModel
// ]

// 1. Initialize
const app = dva({
    history: createHistory()
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/dynamic').default);
app.model(require('./models/user.ts').default);
app.model(require('./models/notification').default);
app.model(require('./models/dialog').default);
app.model(require('./models/article').default);
app.model(require('./models/message').default);
app.model(require('./models/loading').default);
app.model(require('./models/search').default);

// 4. Router
app.router(require('./router.tsx').default);


// 5. Start
app.start('#root') as HTMLAreaElement;
