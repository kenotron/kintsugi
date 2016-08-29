import ArgvOptions from '../ArgvOptions';
import app from '../server';
import * as webpackDevMiddlware from 'webpack-dev-middleware';
import * as webpack from 'webpack';

export default function run(argv: ArgvOptions) {
    app.use(webpackDevMiddlware(webpack({

    })));


    app.listen(300, () => {
        console.log("Dev server started at: http://localhost:3000");
    });
}