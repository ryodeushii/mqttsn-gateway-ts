export class SlipBuffer {
    private start: number;
    private increment: number;
    private buffer: Buffer;
    private size: number;

    constructor(start: number, increment?: number) {
        this.start = start;
        this.increment = increment ? increment : start;
        this.buffer = Buffer.alloc(this.start);
        this.size = 0;
    }

    append(input: number) {
        if (this.size >= this.buffer.length) {
            const newBuffer = Buffer.alloc(this.buffer.length + this.increment);
            this.buffer.copy(newBuffer);
            this.buffer = newBuffer;
        }
        this.buffer[this.size] = input;
        this.size++;
    }

    contentsAndReset(context: any, callback?: Function) {
        if (this.size > 0) {
            const emitThis = Buffer.alloc(this.size);
            this.buffer.copy(emitThis, 0, 0, this.size);
            callback && callback.apply(context, [emitThis]);
            this.size = 0;
        }
    }
}

export class SlipParser {
	private receiver: any;
	private state: SlipParserState;
	private strict: boolean;
	private data: SlipBuffer;
	private error: SlipBuffer;

	constructor(receiver: any, strict?: boolean) {
		if (typeof strict === "undefined" || strict === null) {
			strict = true;
		}
		this.receiver = receiver;
		if (strict) {
			this.state = SlipParserState.STATE_OUT;
		} else {
			this.state = SlipParserState.STATE_IN;
		}
		this.strict = strict;
		this.data = new SlipBuffer(16);
		this.error = new SlipBuffer(16);
	}

	write(input_buffer: Buffer) {
		for (let i = 0, il = input_buffer.length; i < il; i++) {
			switch (this.state) {
				case SlipParserState.STATE_OUT:
					switch (input_buffer[i]) {
						case SlipParserChar.CHAR_END:
							this.state = SlipParserState.STATE_IN;
							this.error.contentsAndReset(this.receiver, this.receiver.framing);
							break;
						default:
							this.error.append(input_buffer[i]);
							break;
					}
					break;

				case SlipParserState.STATE_IN:
					switch (input_buffer[i]) {
						case SlipParserChar.CHAR_END:
							if (this.strict) {
								this.state = SlipParserState.STATE_OUT;
							}
							this.data.contentsAndReset(this.receiver, this.receiver.data);
							break;
						case SlipParserChar.CHAR_ESC:
							this.state = SlipParserState.STATE_ESC;
							break;
						default:
							this.data.append(input_buffer[i]);
							break;
					}
					break;

				case SlipParserState.STATE_ESC:
					switch (input_buffer[i]) {
						case SlipParserChar.CHAR_ESC_END:
							this.state = SlipParserState.STATE_IN;
							this.data.append(0xC0);
							break;

						case SlipParserChar.CHAR_ESC_ESC:
							this.state = SlipParserState.STATE_IN;
							this.data.append(0xDB);
							break;

						default:
							this.state = SlipParserState.STATE_IN;
							this.receiver.escape && this.receiver.escape.apply(this.receiver, [input_buffer[i]]);
							break;

					}
					break;
			}
		}
	}
}

enum SlipParserState {
	STATE_OUT = 0,
	STATE_IN = 1,
	STATE_ESC = 2
}

enum SlipParserChar {
	CHAR_END = 0xC0,
	CHAR_ESC = 0xDB,
	CHAR_ESC_END = 0xDC,
	CHAR_ESC_ESC = 0xDD
}

export const SlipGenerator = (input_buffer: Buffer, strict?: boolean): Buffer => {
	let new_buffer_size = input_buffer.length + 1;

	if (typeof strict === "undefined") {
		strict = true;
	}

	if (strict) {
		new_buffer_size++;
	}

	for (let i = 0, il = input_buffer.length; i < il; i++) {
		const c = input_buffer[i];
		if (c == SlipParserChar.CHAR_END || c == SlipParserChar.CHAR_ESC) {
			new_buffer_size++;
		}
	}

	const new_buffer = Buffer.alloc(new_buffer_size);
	let o = 0;

	if (strict) {
		new_buffer[o++] = 0xC0;
	}

	for (let i = 0, il = input_buffer.length; i < il; i++) {
		const c = input_buffer[i];
		switch (c) {
			case SlipParserChar.CHAR_END:
				new_buffer[o++] = SlipParserChar.CHAR_ESC;
				new_buffer[o++] = SlipParserChar.CHAR_ESC_END;
				break;
			case SlipParserChar.CHAR_ESC:
				new_buffer[o++] = SlipParserChar.CHAR_ESC;
				new_buffer[o++] = SlipParserChar.CHAR_ESC_ESC;
				break;
			default:
				new_buffer[o++] = c;
		}
	}
	new_buffer[o++] = 0xC0;

	return new_buffer;

};
