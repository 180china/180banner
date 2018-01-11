uniform sampler2D u_texture;
varying vec2 vUv;
varying vec2 uUv;

void main( void ) {
	vec3 color = (texture2D( u_texture, vUv ).rgb)*0.7 + vec3(17./255.,41./255.,121./255.);
	// vec3 color = (0.7-texture2D( u_texture, vUv ).rgb)*0.7 + vec3(61./255.,129./255.,288./255.);
	
	float alpha = sin(uUv.x * 3.1416) * sin(uUv.y * 3.1416);

	gl_FragColor = vec4( color, alpha );
}