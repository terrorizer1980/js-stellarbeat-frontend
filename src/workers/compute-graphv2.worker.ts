import {forceManyBody, forceSimulation, forceLink, forceX, forceY} from 'd3-force';

const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => {
    const nodes = event.data.nodes;
    const links = event.data.links;

    const simulation = forceSimulation(nodes)
        .force('charge', forceManyBody().strength((d) => {
            return -200;
        }))
        .force('link', forceLink(links).strength( (link: any) => {
            if (link.isClusterLink) {
                return 0.1;
            } else {
                return 0.05;
            }
        }).id( (d: any) => {
            return d.publicKey;
        }))
        .force('x', forceX())
        .force('y', forceY())
        // .alphaDecay(0.1)
        // .alphaMin(0.15)
        // .velocityDecay(0.35);
        .stop();

    for (let i = 0,
             n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        ctx.postMessage({type: 'tick', progress: i / n});
        simulation.tick();
    }

    ctx.postMessage({type: 'end', nodes, links});
});

export default ctx;