
<div class='container'>
	<img src='/computer.png' alt='computer'>
	<div class='screen'>
		<slot />
	</div>
</div>

<style>
	.container {
		position: fixed;
		bottom: -15%;
		left: 50vw;
		z-index: var(--z-index);
		transform: translateX(-50%);
	}

	.screen {
		position: absolute;
		top: 18%;
		left: 18%;
		width: 67%;
		height: 50.5%;
		mix-blend-mode: hard-light;
	}

	/* modified from https://blog.carbonfive.com/vintage-terminal-effect-in-css3/ */
	.screen:before {
      content : '';
      position : absolute;
      width : 100%;
	  top: 0;
	  height: 60px;
      background : #fff;
	  --strength: .6;
	  --strength2: .58;
      background: 
	  	linear-gradient(
			  to bottom, rgba(255,0,0,0) 0%,
			  rgba(255,250,250, var(--strength)) 30%,
			  rgba(255,255,255, var(--strength2)) 71%,
			  rgba(255,0,0,0) 100%
		);
      opacity : .1;
      animation: vline 7.25s linear infinite;
    }

	@keyframes vline {
		0%   { 
			top: -60px;
			opacity: 0;
		}
		5% { opacity: .1; }
		100% { top: 100%;}
	}

	img {
		--size: 950px;
		width: var(--size);
		height: var(--size);
	}
</style>