

""" Lists serial port names

    :raises ImportError:
        When pyserial is not installed.
    :returns:
        A list of the serial ports available on the system
"""

import sys

try:
    import serial.tools.list_ports

    print([comport.device for comport in serial.tools.list_ports.comports()])

except ImportError:
    print("Pyserial is not installed for %s. Please, check that IDF dependencies are installed." % sys.executable)
    sys.exit(1)
